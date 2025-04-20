const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Detectar o IP local para acesso por outros dispositivos
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let ipAddress = '';
    
    // Procurar por um endereço IPv4 não interno
    Object.keys(interfaces).forEach((interfaceName) => {
        interfaces[interfaceName].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
            }
        });
    });
    
    return ipAddress || 'localhost';
}

// Rota para diagnóstico de câmera
app.get('/camera-check', (req, res) => {
    res.sendFile(path.join(__dirname, 'camera-check.html'));
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    const localIP = getLocalIP();
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Para acessar de outros dispositivos use: http://${localIP}:${port}`);
    console.log(`Para criar um túnel HTTPS temporário, execute em outro terminal:`);
    console.log(`ngrok http ${port}`);
}); 