import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://wallpapercave.com/wp/wp2316606.jpg' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://www.brmania.com.br/wp-content/uploads/2023/01/logo-br-mania-1.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Gerenciador de Produtos</Text>
            <Text style={styles.subtitle}>
              Escaneie, cadastre e controle a validade dos seus produtos
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Scanner' as never)}
                style={styles.button}
                icon="barcode-scan"
                buttonColor="#00843D"
                textColor="#FFF"
              >
                Escanear Produto
              </Button>
              
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Products' as never)}
                style={styles.button}
                icon="format-list-bulleted"
                buttonColor="#00843D"
                textColor="#FFF"
              >
                Ver Produtos
              </Button>
              
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Report' as never)}
                style={styles.button}
                icon="file-chart"
                buttonColor="#00843D"
                textColor="#FFF"
              >
                Relatórios
              </Button>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Versão 1.0</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 80,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 15,
    borderRadius: 8,
    paddingVertical: 6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
});

export default HomeScreen; 