const express = require('express');
const path = require('path');
const os = require('os');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = process.env.PORT || 3000;

// Inicializar o Gemini AI com a chave da API
const genAI = new GoogleGenerativeAI('AIzaSyDI9sEOatq9CYjFjxO5fzsvN3knkD6_omc');

// Middleware para parsear JSON
app.use(express.json());

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

// API para buscar informações de produtos
app.post('/api/product-info', async (req, res) => {
    try {
        const { barcode } = req.body;
        
        if (!barcode) {
            return res.status(400).json({ error: 'Código de barras não fornecido' });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Eu tenho um produto com o código de barras ${barcode}. 
        Por favor, forneça informações sobre este produto, como nome do produto.
        Responda apenas com o nome do produto, sem informações adicionais.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ name: text.trim() });
    } catch (error) {
        console.error('Erro ao buscar informações do produto:', error);
        res.status(500).json({ error: 'Erro ao buscar informações do produto' });
    }
});

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