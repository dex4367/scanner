import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import * as SQLite from 'react-native-sqlite-storage';

interface Product {
  id: number;
  code: string;
  name: string;
  expiry_date: string;
}

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const db = SQLite.openDatabase({ name: 'products.db' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products ORDER BY expiry_date ASC',
        [],
        (_, { rows }) => {
          const productsArray = [];
          for (let i = 0; i < rows.length; i++) {
            productsArray.push(rows.item(i));
          }
          setProducts(productsArray);
        },
        (_, error) => {
          console.log('Error loading products:', error);
        }
      );
    });
  };

  const deleteProduct = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM products WHERE id = ?',
        [id],
        () => {
          loadProducts();
        },
        (_, error) => {
          console.log('Error deleting product:', error);
        }
      );
    });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Código: {item.code}</Paragraph>
        <Paragraph>Validade: {item.expiry_date}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => deleteProduct(item.id)}>Excluir</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ProductsScreen; 