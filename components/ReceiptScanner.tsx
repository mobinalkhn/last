import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Text, TextInput, Card, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

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
        if (typeof reader.result === 'string' && reader.result) {
          const base64 = reader.result.split(',')[1];
          // Google Vision API request
          const visionRes = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
            {
              requests: [
                {
                  image: { content: base64 },
                  features: [{ type: 'TEXT_DETECTION' }],
                },
              ],
            }
          );
          const text = visionRes.data.responses[0]?.fullTextAnnotation?.text || '';
          // Extract items (simple line split, can be improved)
          const lines = text.split('\n').filter((l: string) => l.length > 2 && /[a-zA-Z0-9]/.test(l));
          setItems(lines);
          if (onItemsExtracted) onItemsExtracted(lines);
        } else {
          setError('Error reading image.');
        }
      };
    } catch (e) {
      setError('Error scanning receipt or connecting to Google Vision API');
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
