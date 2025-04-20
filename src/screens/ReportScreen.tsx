import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as SQLite from 'react-native-sqlite-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

// Importando os tipos sem as bibliotecas
const RNFS = {
  DocumentDirectoryPath: '/data/user/0/com.productscanner/files'
};
const Share = {
  open: async (options: any) => {
    Alert.alert('Compartilhar', 'Função de compartilhamento simulada. Em um app real, isso abriria opções de compartilhamento.');
    return true;
  }
};

interface Product {
  id: number;
  code: string;
  name: string;
  expiry_date: string;
}

const ReportScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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

  const generatePDF = async () => {
    try {
      setGenerating(true);
      
      // Simular geração de PDF (sem as bibliotecas reais)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const path = `${RNFS.DocumentDirectoryPath}/relatorio_produtos.pdf`;
      
      setGenerating(false);
      return path;
    } catch (error) {
      setGenerating(false);
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const sharePDF = async () => {
    try {
      const pdfPath = await generatePDF();
      const options = {
        title: 'Compartilhar Relatório',
        message: 'Relatório de Produtos',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };
      await Share.open(options);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o relatório');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00843D" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://www.brmania.com.br/wp-content/uploads/2023/01/logo-br-mania-1.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Relatório de Produtos</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Relatório de Produtos</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Total de produtos cadastrados:</Text>
          <Text style={styles.infoValue}>{products.length}</Text>
        </View>
        
        {products.length > 0 && (
          <View style={styles.expiryContainer}>
            <Text style={styles.expiryTitle}>Próximos vencimentos:</Text>
            {products.slice(0, 3).map((product, index) => (
              <View key={index} style={styles.expiryItem}>
                <Text style={styles.expiryName}>{product.name}</Text>
                <Text style={styles.expiryDate}>{product.expiry_date}</Text>
              </View>
            ))}
          </View>
        )}
        
        <Button
          mode="contained"
          onPress={sharePDF}
          style={styles.button}
          disabled={products.length === 0 || generating}
          loading={generating}
          buttonColor="#00843D"
          icon="file-pdf-box"
        >
          {generating ? 'Gerando PDF...' : 'Gerar e Compartilhar PDF'}
        </Button>
        
        {products.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum produto cadastrado para gerar relatório
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Scanner' as never)}
              icon="barcode-scan"
              style={styles.scanButton}
              textColor="#00843D"
            >
              Escanear Produto
            </Button>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00843D',
  },
  expiryContainer: {
    width: '100%',
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  expiryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expiryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expiryName: {
    fontSize: 14,
    flex: 1,
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
  },
  scanButton: {
    borderColor: '#00843D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportScreen; 