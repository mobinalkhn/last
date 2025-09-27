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
      // For web, show options for camera or gallery
      const useCamera = window.confirm('آیا می‌خواهید از دوربین استفاده کنید؟ (Cancel برای انتخاب فایل)');
      
      if (useCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request camera access
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment' // Use back camera if available
            } 
          });
          
          // Create video element and canvas for capture
          const video = document.createElement('video');
          video.srcObject = stream;
          video.autoplay = true;
          video.style.position = 'fixed';
          video.style.top = '0';
          video.style.left = '0';
          video.style.width = '100vw';
          video.style.height = '100vh';
          video.style.zIndex = '9999';
          video.style.objectFit = 'cover';
          
          // Create capture button
          const captureBtn = document.createElement('button');
          captureBtn.innerText = 'عکس بگیر 📸';
          captureBtn.style.position = 'fixed';
          captureBtn.style.bottom = '50px';
          captureBtn.style.left = '50%';
          captureBtn.style.transform = 'translateX(-50%)';
          captureBtn.style.padding = '15px 25px';
          captureBtn.style.fontSize = '18px';
          captureBtn.style.background = '#4CAF50';
          captureBtn.style.color = 'white';
          captureBtn.style.border = 'none';
          captureBtn.style.borderRadius = '10px';
          captureBtn.style.cursor = 'pointer';
          captureBtn.style.zIndex = '10000';
          
          // Create close button
          const closeBtn = document.createElement('button');
          closeBtn.innerText = '✖';
          closeBtn.style.position = 'fixed';
          closeBtn.style.top = '20px';
          closeBtn.style.right = '20px';
          closeBtn.style.padding = '10px';
          closeBtn.style.fontSize = '20px';
          closeBtn.style.background = '#f44336';
          closeBtn.style.color = 'white';
          closeBtn.style.border = 'none';
          closeBtn.style.borderRadius = '50%';
          closeBtn.style.cursor = 'pointer';
          closeBtn.style.zIndex = '10000';
          
          document.body.appendChild(video);
          document.body.appendChild(captureBtn);
          document.body.appendChild(closeBtn);
          
          const cleanup = () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(video);
            document.body.removeChild(captureBtn);
            document.body.removeChild(closeBtn);
          };
          
          captureBtn.onclick = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx!.drawImage(video, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            setImage(dataURL);
            cleanup();
          };
          
          closeBtn.onclick = cleanup;
          
        } catch (error) {
          console.error('Camera access error:', error);
          setError('دسترسی به دوربین امکان‌پذیر نیست. از انتخاب فایل استفاده کنید.');
          // Fallback to file picker
          pickFromGallery();
        }
      } else {
        // Use file picker
        pickFromGallery();
      }
    } else {
      // For mobile, show action sheet
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (result.granted === false) {
        setError('دسترسی به گالری لازم است!');
        return;
      }
      
      let imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
      
      if (!imageResult.canceled) {
        setImage(imageResult.assets[0].uri);
      }
    }
  };
  
  const pickFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const scanReceipt = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setItems([]);
    
    try {
      console.log('Starting scan process...');
      
      // Convert image to base64
      const response = await fetch(image);
      console.log('Fetch response:', response.ok);
      
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          console.log('FileReader completed');
          if (typeof reader.result === 'string' && reader.result) {
            const base64 = reader.result.split(',')[1];
            console.log('Base64 length:', base64.length);
            
            // OCR.space API request
            const formData = new FormData();
            formData.append('base64Image', `data:image/png;base64,${base64}`);
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            
            const ocrRes = await axios.post(
              'https://api.ocr.space/parse/image',
              formData,
              {
                headers: {
                  apikey: 'K87471371288957', // Your OCR.space API key
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            if (ocrRes.data?.ParsedResults?.[0]?.ParsedText) {
              const text = ocrRes.data.ParsedResults[0].ParsedText;
              const lines = text.split('\n').filter((l: string) => l.trim().length > 2 && /[a-zA-Z0-9]/.test(l));
              setItems(lines);
              if (onItemsExtracted) onItemsExtracted(lines);
              console.log('OCR completed successfully');
            } else {
              setError('No text found in the image or OCR failed.');
              console.log('No OCR results');
            }
            
          } else {
            setError('Error reading image.');
            console.log('FileReader result is not string');
          }
        } catch (apiError) {
          console.error('OCR API Error:', apiError);
          setError('Error connecting to OCR service: ' + String(apiError));
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('FileReader error');
        setLoading(false);
      };
      
    } catch (e) {
      console.error('General Error:', e);
      setError('Error processing image: ' + String(e));
      setLoading(false);
    }
    
    // Set timeout to ensure loading stops
    setTimeout(() => {
      setLoading(false);
    }, 15000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Scan Supermarket Receipt</Text>
      <Button mode="contained" onPress={pickImage} style={{ marginBottom: 16 }}>
        Select Receipt Image
      </Button>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button mode="contained" onPress={scanReceipt} disabled={!image || loading} style={{ marginVertical: 16 }}>
        {loading ? 'Scanning...' : 'Scan and Extract Items'}
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
