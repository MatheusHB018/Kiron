// server/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SALT_ROUNDS = 10; // Fator de custo para o hash do bcrypt
const JWT_SECRET = 'seu_segredo_super_secreto_aqui'; // Troque por uma chave segura

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do MedResiduos a funcionar!' });
});

// --- ROTAS DE USUÁRIOS (CRUD COMPLETO E MELHORADO) ---

// LER TODOS os usuários
app.get('/usuarios', (req, res) => {
  // A senha nunca deve ser retornada em listagens
  db.query('SELECT id_usuario, nome, email, tipo, cidade, uf FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

// LER UM usuário pelo ID (para edição)
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  // Retorna todos os campos, exceto a senha
  const query = 'SELECT id_usuario, nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf FROM usuario WHERE id_usuario = ?';
  db.query(query, [id], (err, results) => {
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

// CRIAR um novo usuário (com campos de endereço e hash de senha)
app.post('/usuarios', async (req, res) => {
    // const requesterRole = req.headers['x-user-role'];
    // if (requesterRole !== 'admin') {
    //     return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar usuários.' });
    // }

    const { nome, email, senha, tipoUsuario, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;

    if (!nome || !email || !senha || !tipoUsuario) {
        return res.status(400).json({ error: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
    }

    try {
        // Gera o hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

        const query = `
            INSERT INTO usuario 
            (nome, email, senha, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [nome, email, hashedPassword, tipoUsuario, cep, logradouro, numero, complemento, bairro, cidade, uf];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Erro ao cadastrar usuário:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Este email já está em uso.' });
                }
                return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            }
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
        });
    } catch (error) {
        console.error('Erro ao gerar hash da senha:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


// ATUALIZAR um usuário (com campos de endereço)
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;

  if (!nome || !email || !tipo) {
    return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
  }

  const query = `
    UPDATE usuario 
    SET nome = ?, email = ?, tipo = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? 
    WHERE id_usuario = ?
  `;
  const values = [nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, id];

  db.query(query, values, (err, result) => {
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

// --- ROTA DE LOGIN (com hash de senha e JWT) ---
app.post('/login', (req, res) => {
    // Pega os três campos do corpo da requisição
    const { email, password, lembrarMe } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const user = results[0];

        try {
            const match = await bcrypt.compare(password, user.senha);
            if (!match) {
                return res.status(401).json({ error: 'Email ou senha inválidos.' });
            }

            const { senha, ...userWithoutPassword } = user;
            
            // LÓGICA DO "LEMBRAR-ME":
            // Se lembrarMe for true, o token dura 30 dias. Senão, dura 8 horas.
            const expiresIn = lembrarMe ? '30d' : '8h'; 
            
            const token = jwt.sign(
                { id: user.id_usuario, tipo: user.tipo }, 
                JWT_SECRET, 
                { expiresIn } // Usa a variável de expiração
            );
            
            res.json({ user: userWithoutPassword, token });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao processar o login.' });
        }
    });
});

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
// Este middleware será usado para proteger as rotas de perfil
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) return res.sendStatus(401); // Não autorizado se não houver token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Proibido se o token for inválido
        req.user = user; // Adiciona os dados do usuário (id, tipo) ao objeto da requisição
        next();
    });
};

// --- ROTAS DE PERFIL ---

// Rota para buscar os dados completos do próprio usuário
app.get('/perfil', authenticateToken, (req, res) => {
    const userId = req.user.id;
    // Query corrigida para buscar todos os dados, incluindo endereço
    const query = 'SELECT nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf FROM usuario WHERE id_usuario = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(results[0]);
    });
});

// Rota para atualizar os dados do próprio usuário
app.put('/perfil', authenticateToken, (req, res) => {
    const userId = req.user.id;
    // Pega todos os dados do corpo da requisição
    const { nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;
    
    const query = `
      UPDATE usuario 
      SET nome = ?, email = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? 
      WHERE id_usuario = ?
    `;
    const values = [nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf, userId];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar perfil:", err);
            return res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
        }
        res.json({ message: 'Perfil atualizado com sucesso!' });
    });
});

// Rota para alterar a própria senha
app.put('/perfil/senha', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { senhaAtual, novaSenha } = req.body;

    // 1. Busca o hash da senha atual no banco
    db.query('SELECT senha FROM usuario WHERE id_usuario = ?', [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        const hashedDbPassword = results[0].senha;

        // 2. Compara a senha atual enviada com o hash do banco
        const isMatch = await bcrypt.compare(senhaAtual, hashedDbPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'A senha atual está incorreta.' });
        }

        // 3. Se a senha atual bate, cria o hash da nova senha e atualiza o banco
        const newHashedPassword = await bcrypt.hash(novaSenha, SALT_ROUNDS);
        db.query('UPDATE usuario SET senha = ? WHERE id_usuario = ?', [newHashedPassword, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao alterar a senha.' });
            }
            res.json({ message: 'Senha alterada com sucesso!' });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});