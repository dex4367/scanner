import * as SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'products.db' });

export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        expiry_date TEXT NOT NULL
      )`,
      [],
      () => {
        console.log('Database initialized successfully');
      },
      (_, error) => {
        console.log('Error initializing database:', error);
      }
    );
  });
};

export default db; 