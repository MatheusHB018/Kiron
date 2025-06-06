// Dentro do arquivo server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Porta que o servidor vai escutar

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do MedResiduos funcionando!' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});