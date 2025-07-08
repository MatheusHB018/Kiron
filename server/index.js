// server/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do MedResiduos a funcionar!' });
});

// --- ROTAS DE USUÁRIOS (CRUD COMPLETO) ---

// LER TODOS os usuários
app.get('/usuarios', (req, res) => {
  db.query('SELECT id_usuario, nome, email, tipo FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

// LER UM usuário pelo ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  // Corrigido para usar id_usuario
  db.query('SELECT id_usuario, nome, email, tipo FROM usuario WHERE id_usuario = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(results[0]);
  });
});

// CRIAR um novo usuário (Rota Corrigida)
app.post('/usuarios', (req, res) => {
  const requesterRole = req.headers['x-user-role'];

  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar usuários.' });
  }

  const { nome, email, senha, tipoUsuario } = req.body;

  if (!nome || !email || !senha || !tipoUsuario) {
    return res.status(400).json({ error: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
  }
  
  // Query corrigida para inserir o 'tipo'
  db.query(
    "INSERT INTO usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, senha, tipoUsuario],
    (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este email já está em uso.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
      }
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
    }
  );
});

// ATUALIZAR um usuário
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, tipo } = req.body;

  if (!nome || !email || !tipo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  // Corrigido para usar id_usuario
  const query = 'UPDATE usuario SET nome = ?, email = ?, tipo = ? WHERE id_usuario = ?';
  db.query(query, [nome, email, tipo, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

// APAGAR um usuário
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  // Corrigido para usar id_usuario
  db.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao apagar usuário:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário apagado com sucesso' });
  });
});

// --- ROTA DE LOGIN ---
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
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Email ou senha inválidos.' });
            }
            const { senha, ...userWithoutPassword } = results[0];
            res.json({ user: userWithoutPassword });
        }
    );
});


app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});