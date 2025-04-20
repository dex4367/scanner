import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text, Button, TextInput, Snackbar, Portal, Dialog, FAB, ActivityIndicator } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'react-native-sqlite-storage';

const ScannerScreen = () => {
  const navigation = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('scanner');
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const db = SQLite.openDatabase({ name: 'products.db' });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      
      // Criar tabela de produtos se não existir
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, expiry_date TEXT)',
          [],
          () => console.log('Table created successfully'),
          (_, error) => console.log('Error creating table:', error)
        );
      });
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setBarcode(data);
    setIsSearchingProduct(true);
    setErrorMessage('');
    
    // Simular busca do nome do produto por IA
    setTimeout(() => {
      // Mockando nomes de produtos com base no código de barras
      let productName = '';
      
      if (data.includes('7891') || data.startsWith('789')) {
        productName = 'Produto Brasileiro';
      } else if (data.includes('4902') || data.startsWith('490')) {
        productName = 'Produto Japonês';
      } else if (data.includes('9780') || data.startsWith('978')) {
        productName = 'Livro';
      } else {
        productName = `Produto ${data.substring(0, 6)}`;
      }
      
      setProductName(productName);
      setIsSearchingProduct(false);
      setShowAddDialog(true);
    }, 2000);
  };

  const saveProduct = async () => {
    if (!barcode || !productName) {
      showSnackbar('Preencha todos os campos');
      return;
    }

    // Formatar data DD/MM/YYYY
    const day = expirationDate.getDate().toString().padStart(2, '0');
    const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expirationDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    try {
      setIsLoading(true);
      
      // Salvar no SQLite em vez de AsyncStorage
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO products (code, name, expiry_date) VALUES (?, ?, ?)',
          [barcode, productName, formattedDate],
          (_, result) => {
            if (result.rowsAffected > 0) {
              setIsLoading(false);
              setShowAddDialog(false);
              showSnackbar('Produto salvo com sucesso!');
              
              // Resetar estados
              setScanned(false);
              setBarcode(null);
              setProductName('');
              setExpirationDate(new Date());
              
              // Navegar para a tela de produtos
              setTimeout(() => {
                navigation.navigate('Products' as never);
              }, 1500);
            }
          },
          (_, error) => {
            setIsLoading(false);
            console.error('Erro ao salvar produto:', error);
            showSnackbar('Erro ao salvar produto');
            return false;
          }
        );
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao salvar produto:', error);
      showSnackbar('Erro ao salvar produto');
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onExpirationDateChange = (newDate: Date) => {
    setExpirationDate(newDate);
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00843D" />
        <Text>Verificando permissões da câmera...</Text>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sem acesso à câmera</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Home' as never)}
          buttonColor="#00843D"
        >
          Voltar ao início
        </Button>
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
        <Text style={styles.headerTitle}>Escaneamento de Produtos</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'scanner' && styles.activeTab]} 
          onPress={() => setSelectedTab('scanner')}
        >
          <Text style={[styles.tabText, selectedTab === 'scanner' && styles.activeTabText]}>
            Scanner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'manual' && styles.activeTab]} 
          onPress={() => {
            setSelectedTab('manual');
            setScanned(true);
          }}
        >
          <Text style={[styles.tabText, selectedTab === 'manual' && styles.activeTabText]}>
            Entrada Manual
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'scanner' ? (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.overlay}>
            <View style={styles.scanWindow}></View>
          </View>
          
          {!scanned && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instruction}>
                Aponte a câmera para o código de barras do produto
              </Text>
            </View>
          )}
          
          {scanned && (
            <FAB
              icon="refresh"
              style={styles.fab}
              onPress={() => setScanned(false)}
              color="#FFFFFF"
            />
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.manualContainer}>
          <TextInput
            label="Código de Barras"
            value={barcode || ''}
            onChangeText={setBarcode}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            activeOutlineColor="#00843D"
          />
          
          <TextInput
            label="Nome do Produto"
            value={productName}
            onChangeText={setProductName}
            style={styles.input}
            mode="outlined"
            activeOutlineColor="#00843D"
          />
          
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => {
              // Aqui precisaríamos abrir um seletor de data
              // Como não temos o DateTimePicker, podemos usar uma solução alternativa
              // Por simplicidade, mantemos como está
            }}
          >
            <Text style={styles.datePickerLabel}>Data de Validade:</Text>
            <Text style={styles.dateText}>
              {expirationDate.getDate().toString().padStart(2, '0')}/
              {(expirationDate.getMonth() + 1).toString().padStart(2, '0')}/
              {expirationDate.getFullYear()}
            </Text>
          </TouchableOpacity>
          
          <Button
            mode="contained"
            onPress={saveProduct}
            style={styles.saveButton}
            icon="content-save"
            loading={isLoading}
            disabled={isLoading || !barcode || !productName}
            buttonColor="#00843D"
          >
            Salvar Produto
          </Button>
        </ScrollView>
      )}
      
      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>Adicionar Produto</Dialog.Title>
          <Dialog.Content>
            {isSearchingProduct ? (
              <View style={styles.dialogLoading}>
                <ActivityIndicator size="large" color="#00843D" />
                <Text style={styles.searchingText}>Buscando informações do produto...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.barcodeText}>Código: {barcode}</Text>
                
                <TextInput
                  label="Nome do Produto"
                  value={productName}
                  onChangeText={setProductName}
                  style={styles.dialogInput}
                  mode="outlined"
                  activeOutlineColor="#00843D"
                />
                
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => {
                    // Aqui abriríamos um DatePicker se estivesse disponível
                  }}
                >
                  <Text style={styles.datePickerLabel}>Data de Validade:</Text>
                  <Text style={styles.dateText}>
                    {expirationDate.getDate().toString().padStart(2, '0')}/
                    {(expirationDate.getMonth() + 1).toString().padStart(2, '0')}/
                    {expirationDate.getFullYear()}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowAddDialog(false);
              setScanned(false);
            }}>Cancelar</Button>
            <Button 
              onPress={saveProduct} 
              disabled={isSearchingProduct || isLoading}
              textColor="#00843D"
            >
              Salvar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{backgroundColor: '#333'}}
      >
        {snackbarMessage}
      </Snackbar>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  tab: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00843D',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#00843D',
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanWindow: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00843D',
    backgroundColor: 'transparent',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instruction: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00843D',
  },
  manualContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#86939e',
    borderRadius: 4,
    marginBottom: 20,
  },
  datePickerLabel: {
    fontSize: 16,
    color: '#86939e',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
  },
  dialogInput: {
    marginBottom: 15,
  },
  dialogLoading: {
    alignItems: 'center',
    padding: 20,
  },
  searchingText: {
    marginTop: 15,
    fontSize: 16,
  },
  barcodeText: {
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ScannerScreen;