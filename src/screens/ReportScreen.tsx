import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface Product {
  id: number;
  code: string;
  name: string;
  expiry_date: string;
}

const ReportScreen = () => {
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

  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const lineHeight = 20;
      let y = height - 50;

      // Add title
      page.drawText('Relatório de Produtos', {
        x: 50,
        y,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 40;

      // Add date
      const currentDate = new Date().toLocaleDateString();
      page.drawText(`Data do Relatório: ${currentDate}`, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 30;

      // Add products
      products.forEach((product) => {
        if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }

        page.drawText(`Produto: ${product.name}`, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;

        page.drawText(`Código: ${product.code}`, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;

        page.drawText(`Validade: ${product.expiry_date}`, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight * 2;
      });

      const pdfBytes = await pdfDoc.save();
      const path = `${RNFS.DocumentDirectoryPath}/relatorio_produtos.pdf`;
      await RNFS.writeFile(path, pdfBytes, 'base64');

      return path;
    } catch (error) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório de Produtos</Text>
      <Text style={styles.subtitle}>
        Total de produtos cadastrados: {products.length}
      </Text>
      <Button
        mode="contained"
        onPress={sharePDF}
        style={styles.button}
        disabled={products.length === 0}
      >
        Gerar e Compartilhar PDF
      </Button>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  },
});

export default ReportScreen; 