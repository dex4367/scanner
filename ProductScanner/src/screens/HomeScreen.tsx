import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner de Produtos</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Scanner')}
          style={styles.button}
          icon="camera"
        >
          Escanear Produto
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Products')}
          style={styles.button}
          icon="format-list-bulleted"
        >
          Produtos Cadastrados
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Report')}
          style={styles.button}
          icon="file-pdf"
        >
          Gerar Relatório
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 8,
  },
});

export default HomeScreen; 