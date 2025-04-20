const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Permite conexões de qualquer dispositivo na rede

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '.')));

// Create a simple index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Para acessar de outros dispositivos use: http://192.168.1.4:${PORT}`);
  console.log("Para criar um túnel HTTPS temporário, execute em outro terminal:");
  console.log("ngrok http 3000");
}); 