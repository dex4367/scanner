import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'react-native-sqlite-storage';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [productCode, setProductCode] = useState('');
  const navigation = useNavigation();
  const db = SQLite.openDatabase({ name: 'products.db' });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setProductCode(data);
    // Here you would typically call an API to get product information
    // For now, we'll just set a placeholder name
    setProductName(`Produto ${data}`);
  };

  const saveProduct = () => {
    if (!productCode || !expiryDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO products (code, name, expiry_date) VALUES (?, ?, ?)',
        [productCode, productName, expiryDate],
        (_, result) => {
          Alert.alert('Sucesso', 'Produto salvo com sucesso!');
          navigation.navigate('Products');
        },
        (_, error) => {
          Alert.alert('Erro', 'Falha ao salvar o produto');
        }
      );
    });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            label="Código do Produto"
            value={productCode}
            onChangeText={setProductCode}
            style={styles.input}
            disabled
          />
          <TextInput
            label="Nome do Produto"
            value={productName}
            onChangeText={setProductName}
            style={styles.input}
          />
          <TextInput
            label="Data de Validade"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={styles.input}
            placeholder="DD/MM/AAAA"
          />
          <Button
            mode="contained"
            onPress={saveProduct}
            style={styles.button}
          >
            Salvar Produto
          </Button>
          <Button
            mode="outlined"
            onPress={() => setScanned(false)}
            style={styles.button}
          >
            Escanear Novamente
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default ScannerScreen; 