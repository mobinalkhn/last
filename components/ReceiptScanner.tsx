/**
 * ReceiptScanner Component
 * Clean and simple receipt scanning functionality
 */

import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Platform } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

type ReceiptScannerProps = {
  onItemsExtracted?: (items: string[]) => void;
};

export default function ReceiptScanner({ onItemsExtracted }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState('');

  const pickImage = async () => {
    setError('');
    
    if (Platform.OS === 'web') {
      const useCamera = window.confirm('Use camera? (Cancel to select file)');
      
      if (useCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const captureBtn = document.createElement('button');
            captureBtn.innerText = 'Capture';
            captureBtn.onclick = () => {
              if (context) {
                context.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    setImage(url);
                  }
                });
              }
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(video);
              document.body.removeChild(captureBtn);
            };
            
            document.body.appendChild(video);
            document.body.appendChild(captureBtn);
          };
        } catch (cameraError) {
          console.error('Camera error:', cameraError);
          setError('Camera access not available. Please select a file.');
        }
        return;
      }
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setImage(url);
        }
      };
      input.click();
    } else {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        setError('Permission to access media library is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const scanReceipt = async () => {
    if (!image) return;
    
    setLoading(true);
    setError('');
    setItems([]);
    
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          if (typeof reader.result === 'string' && reader.result) {
            const base64 = reader.result.split(',')[1];
            
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            formData.append('detectOrientation', 'true');
            formData.append('scale', 'true');
            formData.append('OCREngine', '2');
            
            const ocrRes = await axios.post(
              'https://api.ocr.space/parse/image',
              formData,
              {
                headers: {
                  apikey: 'K87471371288957',
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            if (ocrRes.data?.ParsedResults?.[0]?.ParsedText) {
              const text = ocrRes.data.ParsedResults[0].ParsedText;
              const lines = text.split('\n').filter((l: string) => 
                l.trim().length > 2 && /[a-zA-Z0-9]/.test(l)
              );
              
              setItems(lines);
              if (onItemsExtracted) onItemsExtracted(lines);
            } else {
              setError('No readable text found in image. Please try a clearer image.');
            }
            
          } else {
            setError('Error reading image. Please try again.');
          }
        } catch (apiError) {
          console.error('OCR API Error:', apiError);
          setError('Error connecting to OCR service: ' + String(apiError));
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      console.error('General error:', error);
      setError('An error occurred: ' + String(error));
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Receipt Scanner</Text>
      <Button mode="contained" onPress={pickImage} style={{ marginBottom: 16 }}>
        Select Image
      </Button>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button mode="contained" onPress={scanReceipt} disabled={!image || loading} style={{ marginVertical: 16 }}>
        {loading ? 'Processing...' : 'Extract Text'}
      </Button>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {items.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <Card.Title title="Detected Items" />
          <Card.Content>
            {items.map((item, idx) => (
              <Text key={idx}>{item}</Text>
            ))}
          </Card.Content>
        </Card>
      )}
      {loading && <ActivityIndicator animating size="large" style={{ marginTop: 16 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});