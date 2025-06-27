// Dentro do arquivo server/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001; // Porta que o servidor vai escutar

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do MedResiduos funcionando!' });
});

// Corrige rota de listagem para plural
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  db.query(
    'SELECT * FROM usuario WHERE email = ? AND senha = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
      }
      // Não envie a senha de volta!
      const { senha, ...userWithoutPassword } = results[0];
      res.json({ user: userWithoutPassword });
    }
  );
});

// Rota para cadastrar novo usuário
app.post('/usuarios', (req, res) => {
  const { nome, email, senha, tipoUsuario } = req.body; // tipoUsuario = tipo do usuário logado
  if (tipoUsuario !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem cadastrar usuários.' });
  }
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  db.query(
    "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário', details: err });
      }
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
  );
});

// ROTA PARA DELETAR UM USUÁRIO
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params; // Pega o ID do usuário da URL

  db.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
    // Verifica se alguma linha foi de fato afetada (se o usuário existia)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});