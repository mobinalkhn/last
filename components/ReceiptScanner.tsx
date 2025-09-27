import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
            
            // Test without OCR first - just show dummy data
            const dummyItems = [
              'Test Item 1 - Milk',
              'Test Item 2 - Bread', 
              'Test Item 3 - Eggs',
              'Base64 length: ' + base64.substring(0, 50) + '...'
            ];
            
            setItems(dummyItems);
            if (onItemsExtracted) onItemsExtracted(dummyItems);
            
            console.log('Dummy items set');
            
          } else {
            setError('Error reading image.');
            console.log('FileReader result is not string');
          }
        } catch (apiError) {
          console.error('Processing Error:', apiError);
          setError('Error processing: ' + String(apiError));
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
    }, 10000);
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
