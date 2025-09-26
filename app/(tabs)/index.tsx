import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import ReceiptScanner from '../../components/ReceiptScanner';
import ProductDetails from '../../components/ProductDetails';

export default function HomeScreen() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text variant="headlineMedium" style={{ marginTop: 8, fontWeight: 'bold' }}>Welcome to Smart Receipt Scanner</Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, textAlign: 'center' }}>
            Scan your supermarket receipts and get instant product info from OpenFoodFacts!
          </Text>
        </Card.Content>
      </Card>
      <Divider style={{ marginVertical: 16 }} />
      <Card style={styles.sectionCard}>
        <Card.Title title="Step 1: Upload or Take a Photo of Your Receipt" />
        <Card.Content>
          <ReceiptScanner onItemsExtracted={setItems} />
        </Card.Content>
      </Card>
      <Card style={styles.sectionCard}>
        <Card.Title title="Step 2: View and Explore Your Items" />
        <Card.Content>
          <ProductDetails items={items} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 16,
  },
  sectionCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 12,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 8,
  },
});
