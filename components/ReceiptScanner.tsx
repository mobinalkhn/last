import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Text, TextInput, Card, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri as string);
    }
  };

  const scanReceipt = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setItems([]);
    
    try {
      // Convert image to base64
      const response = await fetch(image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          if (typeof reader.result === 'string' && reader.result) {
            const base64 = reader.result.split(',')[1];
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
            } else {
              setError('No text found in the image or OCR failed.');
            }
          } else {
            setError('Error reading image.');
          }
        } catch (apiError) {
          console.error('OCR API Error:', apiError);
          setError('Error connecting to OCR service. Please check your API key.');
        }
      };
    } catch (e) {
      console.error('General Error:', e);
      setError('Error processing image or connecting to OCR service');
    } finally {
      setLoading(false);
    }
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
  },
});
