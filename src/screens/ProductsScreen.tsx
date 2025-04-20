import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import * as SQLite from 'react-native-sqlite-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

interface Product {
  id: number;
  code: string;
  name: string;
  expiry_date: string;
}

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const db = SQLite.openDatabase({ name: 'products.db' });

  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const loadProducts = () => {
    setLoading(true);
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
          setLoading(false);
        },
        (_, error) => {
          console.log('Error loading products:', error);
          setLoading(false);
          return false;
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
          return false;
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
        <Button onPress={() => deleteProduct(item.id)} textColor="#B71C1C">Excluir</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://www.brmania.com.br/wp-content/uploads/2023/01/logo-br-mania-1.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Produtos Cadastrados</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00843D" />
          <Text>Carregando produtos...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Scanner' as never)}
            icon="barcode-scan"
            style={styles.scanButton}
            buttonColor="#00843D"
          >
            Escanear Produto
          </Button>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Scanner' as never)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00843D',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logo: {
    width: 100,
    height: 40,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  scanButton: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#00843D',
    borderRadius: 28,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default ProductsScreen; 