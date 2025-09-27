/**
 * ScanMarket - Main Home Screen
 * 
 * This is the primary screen of the ScanMarket app where users can:
 * 1. Scan or upload receipt images
 * 2. View extracted items and their details
 * 
 * The screen uses a card-based layout with Material Design principles
 * and integrates the ReceiptScanner and ProductDetails components.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import ProductDetails from '../components/ProductDetails';
import ReceiptScanner from '../components/ReceiptScanner';

export default function HomeScreen() {
  // State to store extracted items from receipt scanning
  const [items, setItems] = useState<string[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Logo and Branding Section */}
      <Card style={styles.welcomeCard}>
        <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Receipt Scanner</Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Visual separator */}
      <Divider style={{ marginVertical: 16 }} />
      
      {/* Step 1: Receipt Scanning Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="Upload Receipt" />
        <Card.Content>
          {/* Main receipt scanner component */}
          <ReceiptScanner onItemsExtracted={setItems} />
        </Card.Content>
      </Card>
      
      {/* Step 2: Product Details Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="Extracted Items" />
        <Card.Content>
          {/* Product details component that shows extracted items */}
          <ProductDetails items={items} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

/**
 * Styles for the Home Screen
 * Following Material Design principles with card-based layout
 */
const styles = StyleSheet.create({
  // Main container with light background and padding
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f6f6f6', // Light gray background for contrast
  },
  
  // Welcome/branding card at the top
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2, // Android shadow
    borderRadius: 16, // Rounded corners
  },
  
  // Cards for each section (Scanner and Details)
  sectionCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 1, // Subtle shadow
    borderRadius: 12, // Slightly rounded corners
  },
  
  // Container for logo elements
  logoContainer: {
    alignItems: 'center',
  },
  
  // App name text styling
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2', // Simple blue color
  },
});