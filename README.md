# Scanner de Produtos - Guia do Usuário

## Como usar o aplicativo

1. **Iniciar o servidor:**
   ```
   node server.js
   ```

2. **Acessar o aplicativo no computador:**
   - Abra o navegador e acesse: `http://localhost:3000`

3. **Acessar o aplicativo no celular:**
   - Conecte o celular à mesma rede Wi-Fi do computador
   - Acesse o IP do computador na rede: `http://192.168.1.4:3000` (substitua pelo IP correto do seu computador)
   - OU para criar um túnel HTTPS (necessário para a câmera em muitos dispositivos):
     ```
     ngrok http 3000
     ```
     E acesse a URL https que o ngrok fornecer.

## Resolvendo problemas comuns

### O código de barras não está sendo detectado:

1. **Melhore a iluminação**
   - Certifique-se de que o código de barras está bem iluminado
   - Use o botão "Ligar Flash" se disponível no seu dispositivo

2. **Tente diferentes distâncias**
   - Mantenha o código de barras entre 10-20cm da câmera
   - Tente mover lentamente para encontrar a distância ideal

3. **Estabilize o celular**
   - Mantenha o celular o mais estável possível
   - Evite movimentos bruscos

4. **Tente as opções alternativas**
   - Use o botão "Tirar Foto" para capturar uma imagem do código
   - Use o botão "Carregar Imagem" para selecionar uma foto já existente

5. **Troque a câmera**
   - Se seu dispositivo tem câmeras frontal e traseira, use o botão "Trocar Câmera"
   - A câmera traseira geralmente tem resolução melhor

6. **Certifique-se de estar usando HTTPS ou localhost**
   - Em muitos navegadores, a câmera só funciona em conexões seguras
   - Use ngrok para criar um túnel HTTPS
   - Ou acesse via localhost no próprio dispositivo

### Erro ao carregar a câmera:

1. **Verifique as permissões**
   - Certifique-se de que seu navegador tem permissão para acessar a câmera
   - Procure o ícone de câmera na barra de endereço do navegador

2. **Use um navegador moderno**
   - Chrome, Firefox, Safari ou Edge atualizado
   - Evite navegadores antigos que não suportam as APIs de câmera

3. **Reinicie o aplicativo**
   - Às vezes, basta reiniciar o aplicativo para resolver problemas de permissão

## Recursos adicionais

1. **Escaneamento automático**
   - O aplicativo tenta escanear automaticamente quando detecta um código
   - A linha vermelha animada indica o processo de escaneamento

2. **Feedback visual**
   - A área de escaneamento é destacada para ajudar no posicionamento
   - Mensagens de status informam o que está acontecendo

3. **Relatórios**
   - Acesse a seção "Gerar Relatório" para criar um PDF com todos os produtos
   - Os produtos são ordenados por data de validade

## Tipos de códigos suportados

- Código de barras EAN-13 (usado em produtos comerciais)
- Código de barras EAN-8 (versão curta do EAN)
- Código QR (códigos quadrados 2D)
- Código 39 (usado em indústria e logística)
- Código 93 (usado em logística)
- Código 128 (usado em logística e remessas)
- Data Matrix (código 2D usado em indústria)
- Aztec (código 2D usado em bilhetes)
- ITF (Interleaved 2 of 5, usado em embalagens)

## Funcionalidades

- **Escaneamento de códigos de barras/QR code** usando a câmera do dispositivo
- **Armazenamento de produtos** com informações como:
  - Código do produto
  - Nome do produto
  - Data de validade
- **Listagem de produtos** cadastrados
- **Geração de relatórios em PDF** ordenados por data de validade
- **Armazenamento local** usando IndexedDB (os dados permanecem mesmo após fechar o navegador)

## Tecnologias utilizadas

- HTML5, CSS3 e JavaScript
- IndexedDB para armazenamento local
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) para escaneamento de códigos
- [jsPDF](https://github.com/parallax/jsPDF) para geração de PDFs

## Como usar

1. Acesse a aplicação em [https://seu-usuario.github.io/scanner-produtos](https://seu-usuario.github.io/scanner-produtos)
2. Na tela inicial, escolha uma das opções:
   - **Escanear Produto**: Escaneia o código de barras e adiciona um novo produto
   - **Produtos Cadastrados**: Visualiza a lista de produtos salvos
   - **Gerar Relatório**: Cria um PDF com todos os produtos ordenados por data de validade

## Importante

Para usar a funcionalidade de câmera, é necessário acessar a aplicação via HTTPS ou localhost devido a restrições de segurança dos navegadores.

## Executando localmente

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/scanner-produtos.git
```

2. Abra o arquivo `index.html` em um servidor local.
   Por exemplo, usando o Python:
```bash
python -m http.server
```

3. Acesse http://localhost:8000 no seu navegador

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.