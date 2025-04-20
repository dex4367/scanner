import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ReportScreen from './src/screens/ReportScreen';

// Database
import { initDatabase } from './src/database/init';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    // Initialize the database when the app starts
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Scanner de Produtos' }}
            />
            <Stack.Screen 
              name="Scanner" 
              component={ScannerScreen}
              options={{ title: 'Escanear Produto' }}
            />
            <Stack.Screen 
              name="Products" 
              component={ProductsScreen}
              options={{ title: 'Produtos Cadastrados' }}
            />
            <Stack.Screen 
              name="Report" 
              component={ReportScreen}
              options={{ title: 'Relatório' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App; 