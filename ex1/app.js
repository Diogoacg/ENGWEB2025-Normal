const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// Inicializar app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão ao MongoDB
mongoose.connect('mongodb://localhost:27017/eurovisao', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexão ao MongoDB estabelecida com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/', routes);

// Iniciar o servidor
const PORT = 25000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});