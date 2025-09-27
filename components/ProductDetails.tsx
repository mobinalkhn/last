import axios from 'axios';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

interface Props {
  items: string[];
}

export default function ProductDetails({ items }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(
        items.map(async (item) => {
          // Try to find by barcode, fallback to search by name
          let res;
          if (/^\d{8,13}$/.test(item)) {
            res = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${item}.json`);
            if (res.data.status === 1) return res.data.product;
          }
          // Fallback: search by name
          res = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
            params: {
              search_terms: item,
              search_simple: 1,
              action: 'process',
              json: 1,
            },
          });
          return res.data.products?.[0] || { product_name: item };
        })
      );
      setProducts(results);
    } catch (e) {
  setError('Error fetching item details from OpenFoodFacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={fetchDetails} disabled={loading || items.length === 0}>
        Get Details
      </Button>
      {loading && <ActivityIndicator animating size="large" style={{ marginTop: 16 }} />}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <ScrollView style={{ width: '100%' }}>
        {products.map((prod, idx) => (
          <Card key={idx} style={{ marginVertical: 8 }}>
            <Card.Title title={prod.product_name || 'Unknown'} />
            <Card.Content>
              <Text>Brand: {prod.brands || '-'}</Text>
              <Text>Category: {prod.categories || '-'}</Text>
              <Text>Energy: {prod.nutriments?.energy_100g || '-'} kcal/100g</Text>
              <Text>Barcode: {prod.code || '-'}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
});
