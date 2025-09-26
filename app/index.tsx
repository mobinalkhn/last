import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import ReceiptScanner from '../components/ReceiptScanner';
import ProductDetails from '../components/ProductDetails';

export default function IndexScreen() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ReceiptScanner onItemsExtracted={setItems} />
      <ProductDetails items={items} />
    </ScrollView>
  );
}
