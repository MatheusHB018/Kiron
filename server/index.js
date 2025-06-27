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

// Rota para cadastrar novo paciente
app.post('/pacientes', (req, res) => {
  const { nome, cpf, telefone, email, endereco, data_nascimento } = req.body;

  if (!nome || !cpf || !telefone || !email || !endereco || !data_nascimento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const query = 'INSERT INTO paciente (nome, cpf, telefone, email, endereco, data_nascimento) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nome, cpf, telefone, email, endereco, data_nascimento];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar paciente:', err);
      // Verifica erro de CPF duplicado
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'CPF já cadastrado no sistema.' });
      }
      return res.status(500).json({ error: 'Erro interno no servidor ao cadastrar paciente.' });
    }
    res.status(201).json({ message: 'Paciente cadastrado com sucesso!', id: result.insertId });
  });
});

// Rota para LISTAR TODOS os pacientes
app.get('/pacientes', (req, res) => {
  const query = 'SELECT id, nome, cpf, telefone, email FROM paciente ORDER BY nome ASC';
  db.query(query, (err, data) => {
    if (err) {
      console.error("Erro ao buscar pacientes:", err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
    return res.json(data);
  });
});

// Rota para BUSCAR UM paciente específico pelo ID (para a tela de edição)
app.get('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  // A data_nascimento é formatada para YYYY-MM-DD para ser compatível com o input type="date"
  const query = 'SELECT id, nome, cpf, telefone, email, endereco, DATE_FORMAT(data_nascimento, "%Y-%m-%d") as data_nascimento FROM paciente WHERE id = ?';
  
  db.query(query, [id], (err, data) => {
    if (err) {
      console.error("Erro ao buscar paciente:", err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }
    return res.json(data[0]);
  });
});


// Rota para ATUALIZAR um paciente
app.put('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email, endereco, data_nascimento } = req.body;

  if (!nome || !cpf || !telefone || !email || !endereco || !data_nascimento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const query = 'UPDATE paciente SET `nome` = ?, `cpf` = ?, `telefone` = ?, `email` = ?, `endereco` = ?, `data_nascimento` = ? WHERE id = ?';
  const values = [nome, cpf, telefone, email, endereco, data_nascimento, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar paciente:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'CPF já pertence a outro paciente.' });
      }
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }
    res.status(200).json({ message: 'Paciente atualizado com sucesso!' });
  });
});

// Rota para DELETAR um paciente
app.delete('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM paciente WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar paciente:', err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }
    res.status(200).json({ message: 'Paciente deletado com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});