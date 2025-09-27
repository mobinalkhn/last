import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import ProductDetails from '../components/ProductDetails';
import ReceiptScanner from '../components/ReceiptScanner';

export default function HomeScreen() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛒</Text>
            <Text style={styles.logoText}>ScanMarket</Text>
          </View>
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
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d3a',
    letterSpacing: 1,
  },
});
