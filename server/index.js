// server/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const NotificationService = require('./NotificationService'); // 1. IMPORTA O SINGLETON
const { sendWhatsappMessage } = require('./whatsappService'); // <- serviço whatsapp
require('dotenv').config();

const app = express();
const PORT = 3001;
const SALT_ROUNDS = 10;
const JWT_SECRET = 'MedResiduosSecretKey'; 

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DO SERVIÇO DE EMAIL (NODEMAILER) ---
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "manoelaps2022@gmail.com",
        pass: "aryl sfjn tojr bzdv"
    },
});

const resetCodes = {};

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do MedResiduos a funcionar!' });
});

// Rota para enviar mensagem WhatsApp para paciente com base na entrega
app.post('/whatsapp/entregas/:id/send', async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  // Buscar dados da entrega + paciente
  const query = `SELECT e.*, p.nome as paciente_nome, p.telefone as paciente_telefone, r.nome as residuo_nome
                 FROM entrega_materiais e
                 JOIN paciente p ON e.id_paciente = p.id_paciente
                 JOIN residuo r ON e.id_residuo = r.id_residuo
                 WHERE e.id_entrega = ?`;
  db.query(query, [id], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar entrega.' });
    if (results.length === 0) return res.status(404).json({ error: 'Entrega não encontrada.' });
    const entrega = results[0];
    if (!entrega.paciente_telefone) return res.status(400).json({ error: 'Paciente sem telefone cadastrado.' });

    const defaultMsg = `Olá ${entrega.paciente_nome}! Aqui é do MedResiduos. O material "${entrega.residuo_nome}" entregue em ${new Date(entrega.data_entrega).toLocaleDateString('pt-BR')} está com devolução prevista para ${entrega.data_prevista_devolucao ? new Date(entrega.data_prevista_devolucao).toLocaleDateString('pt-BR') : 'N/D'}. Por favor, regularize a devolução. Qualquer dúvida responda esta mensagem.`;
    const texto = mensagem && mensagem.trim() !== '' ? mensagem : defaultMsg;
    const sendResult = await sendWhatsappMessage(entrega.paciente_telefone, texto);
    if (!sendResult.ok && !sendResult.skipped) return res.status(500).json({ error: 'Falha ao enviar WhatsApp', details: sendResult.error });
    res.json({ message: sendResult.skipped ? 'Envio ignorado (configuração ausente)' : 'Mensagem enviada com sucesso', details: sendResult });
  });
});

// Rota específica para coletas (não reutiliza entregas)
app.post('/whatsapp/coletas/:id/send', (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  const query = `SELECT a.*, p.nome as paciente_nome, p.telefone as paciente_telefone
                 FROM agenda_de_coleta a
                 JOIN paciente p ON a.id_paciente = p.id_paciente
                 WHERE a.id_agenda = ?`;
  db.query(query, [id], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar coleta.' });
    if (results.length === 0) return res.status(404).json({ error: 'Coleta não encontrada.' });
    const coleta = results[0];
    if (!coleta.paciente_telefone) return res.status(400).json({ error: 'Paciente sem telefone cadastrado.' });

    const dataAgendada = coleta.data_agendada ? new Date(coleta.data_agendada).toLocaleString('pt-BR') : 'N/D';
    const defaultMsg = `Olá ${coleta.paciente_nome}! Lembramos da coleta agendada para ${dataAgendada}. Por favor, confirme a realização ou entre em contacto para reagendar.`;
    const texto = mensagem && mensagem.trim() !== '' ? mensagem : defaultMsg;
    const sendResult = await sendWhatsappMessage(coleta.paciente_telefone, texto);
    if (!sendResult.ok && !sendResult.skipped) return res.status(500).json({ error: 'Falha ao enviar WhatsApp', details: sendResult.error });
    res.json({ message: sendResult.skipped ? 'Envio ignorado (configuração ausente)' : 'Mensagem enviada com sucesso', details: sendResult });
  });
});

// --- ROTA PARA VISUALIZAR NOTIFICAÇÕES (PARA DEMONSTRAÇÃO) ---
app.get('/notificacoes', (req, res) => {
    const unread = NotificationService.getUnreadNotifications();
    res.json({
        total: unread.length,
        notificacoes: unread
    });
});


// --- ROTAS DE COLETAS ---
app.get('/coletas', (req, res) => {
  db.query('SELECT * FROM agenda_de_coleta', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar coletas' });
    res.json(results);
  });
});

app.get('/coletas/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM agenda_de_coleta WHERE id_agenda = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar coleta' });
    if (results.length === 0) return res.status(404).json({ error: 'Coleta não encontrada' });
    res.json(results[0]);
  });
});

app.post('/coletas', (req, res) => {
  const { id_paciente, id_parceiro, data_agendada } = req.body;
  if (!id_paciente || !id_parceiro || !data_agendada) {
    return res.status(400).json({ error: 'Paciente, parceiro e data agendada são obrigatórios.' });
  }
  const query = 'INSERT INTO agenda_de_coleta (id_paciente, id_parceiro, data_agendada, status) VALUES (?, ?, ?, ?)';
  db.query(query, [id_paciente, id_parceiro, data_agendada, 'agendada'], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao agendar coleta' });
    
    // 2. USA O SINGLETON
    NotificationService.addNotification(
      'NOVA_COLETA',
      `Nova coleta agendada para o paciente ID ${id_paciente}`,
      { pacienteId: id_paciente, parceiroId: id_parceiro, data: data_agendada }
    );

    db.query('SELECT * FROM agenda_de_coleta WHERE id_agenda = ?', [result.insertId], (err2, results2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao buscar coleta agendada' });
      res.status(201).json(results2[0]);
    });
  });
});

app.put('/coletas/:id', (req, res) => {
  const { id } = req.params;
  const { id_paciente, id_parceiro, data_agendada, status } = req.body;
  const query = 'UPDATE agenda_de_coleta SET id_paciente = ?, id_parceiro = ?, data_agendada = ?, status = ? WHERE id_agenda = ?';
  db.query(query, [id_paciente, id_parceiro, data_agendada, status, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar coleta' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Coleta não encontrada' });
    res.json({ message: 'Coleta atualizada com sucesso!' });
  });
});

app.put('/coletas/:id/confirmar', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE agenda_de_coleta SET status = ? WHERE id_agenda = ?', ['realizada', id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao confirmar coleta' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Coleta não encontrada' });
    res.json({ message: 'Coleta confirmada com sucesso!' });
  });
});


// --- ROTAS DE PARCEIROS ---
app.get('/parceiros', (req, res) => {
  db.query('SELECT * FROM parceiro', (err, results) => {
    if (err) {
      console.error("Erro no banco de dados:", err);
      return res.status(500).json({ error: 'Erro ao buscar parceiros' });
    }
    res.json(results);
  });
});

app.get('/parceiros/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM parceiro WHERE id_parceiro = ?', [id], (err, results) => {
    if (err) {
      console.error("Erro no banco de dados:", err);
      return res.status(500).json({ error: 'Erro ao buscar parceiro' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    res.json(results[0]);
  });
});

app.post('/parceiros', (req, res) => {
  const {
    nome, cnpj, tipo, telefone, email, inscricao_estadual, responsavel, observacoes,
    cep, logradouro, numero, complemento, bairro, cidade, estado
  } = req.body;

  if (!nome || !cnpj || !tipo) {
    return res.status(400).json({ error: 'Nome, CNPJ e tipo são obrigatórios.' });
  }

  const query = `
    INSERT INTO parceiro 
    (nome, cnpj, inscricao_estadual, responsavel, observacoes, tipo, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    nome, cnpj, inscricao_estadual, responsavel, observacoes, tipo, telefone, email,
    cep, logradouro, numero, complemento, bairro, cidade, estado
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir parceiro no banco de dados:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'CNPJ já cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar parceiro.' });
    }
    res.status(201).json({ message: 'Parceiro cadastrado com sucesso!', id_parceiro: result.insertId });
  });
});

app.put('/parceiros/:id', (req, res) => {
  const { id } = req.params;
  const {
    nome, cnpj, tipo, telefone, email, inscricao_estadual, responsavel, observacoes,
    cep, logradouro, numero, complemento, bairro, cidade, estado
  } = req.body;

  if (!nome || !cnpj || !tipo) {
    return res.status(400).json({ error: 'Nome, CNPJ e tipo são obrigatórios.' });
  }
  
  const query = `
    UPDATE parceiro SET 
    nome = ?, cnpj = ?, inscricao_estadual = ?, responsavel = ?, observacoes = ?, tipo = ?, 
    telefone = ?, email = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, 
    bairro = ?, cidade = ?, estado = ? 
    WHERE id_parceiro = ?
  `;
  
  const values = [
    nome, cnpj, inscricao_estadual, responsavel, observacoes, tipo, telefone, email,
    cep, logradouro, numero, complemento, bairro, cidade, estado,
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar parceiro no banco de dados:", err);
      return res.status(500).json({ error: 'Erro ao atualizar parceiro.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    res.json({ message: 'Parceiro atualizado com sucesso!' });
  });
});

app.delete('/parceiros/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM parceiro WHERE id_parceiro = ?', [id], (err, result) => {
    if (err) {
       console.error("Erro ao excluir parceiro no banco de dados:", err);
      return res.status(500).json({ error: 'Erro ao excluir parceiro' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    res.json({ message: 'Parceiro excluído com sucesso!' });
  });
});


// --- ROTAS DE PACIENTES ---
app.get('/pacientes', (req, res) => {
    db.query('SELECT * FROM paciente', (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar pacientes' });
        res.json(results);
    });
});

app.get('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM paciente WHERE id_paciente = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar paciente' });
        if (results.length === 0) return res.status(404).json({ error: 'Paciente não encontrado' });
        res.json(results[0]);
    });
});

app.post('/pacientes', (req, res) => {
    const { nome, cpf, telefone, email, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;
    if (!nome || !cpf) return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
    
    const nascimento = data_nascimento || null;

    const query = 'INSERT INTO paciente (nome, cpf, telefone, email, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nome, cpf, telefone, email, nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado];
    db.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'CPF já cadastrado.' });
            return res.status(500).json({ error: 'Erro ao cadastrar paciente' });
        }
        res.status(201).json({ message: 'Paciente cadastrado com sucesso!', id: result.insertId });
    });
});

app.put('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cpf, telefone, email, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;
    if (!nome || !cpf) return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });

    const nascimento = data_nascimento || null;

    const query = 'UPDATE paciente SET nome = ?, cpf = ?, telefone = ?, email = ?, data_nascimento = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ? WHERE id_paciente = ?';
    const values = [nome, cpf, telefone, email, nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, id];
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar paciente' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Paciente não encontrado' });
        res.json({ message: 'Paciente atualizado com sucesso!' });
    });
});

app.delete('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM paciente WHERE id_paciente = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao excluir paciente' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Paciente não encontrado' });
        res.json({ message: 'Paciente excluído com sucesso!' });
    });
});


// --- ROTAS DE GESTÃO DE USUÁRIOS (CRUD) ---
app.get('/usuarios', (req, res) => {
  db.query('SELECT id_usuario, nome, email, tipo, cidade, uf FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
    res.json(results);
  });
});

app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id_usuario, nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf FROM usuario WHERE id_usuario = ?';
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha, tipoUsuario, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;
    if (!nome || !email || !senha || !tipoUsuario) return res.status(400).json({ error: 'Nome, email, senha e tipo são obrigatórios.' });
    try {
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
        const query = 'INSERT INTO usuario (nome, email, senha, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, email, hashedPassword, tipoUsuario, cep, logradouro, numero, complemento, bairro, cidade, uf];
        db.query(query, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Este email já está em uso.' });
                return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            }
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;
  if (!nome || !email || !tipo) return res.status(400).json({ error: 'Nome, email e tipo são obrigatórios' });
  const query = 'UPDATE usuario SET nome = ?, email = ?, tipo = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id_usuario = ?';
  const values = [nome, email, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao apagar usuário' });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário apagado com sucesso' });
  });
});


// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, password, lembrarMe } = req.body; 
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Email ou senha inválidos.' });
        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.senha);
            if (!match) return res.status(401).json({ error: 'Email ou senha inválidos.' });
            const { senha, ...userWithoutPassword } = user;
            const expiresIn = lembrarMe ? '30d' : '8h';
            const token = jwt.sign({ id: user.id_usuario, tipo: user.tipo }, JWT_SECRET, { expiresIn });
            res.json({ user: userWithoutPassword, token });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao processar o login.' });
        }
    });
});


// --- MIDDLEWARE E ROTAS DE PERFIL ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/perfil', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf FROM usuario WHERE id_usuario = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(results[0]);
    });
});

app.put('/perfil', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body;
    const query = 'UPDATE usuario SET nome = ?, email = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id_usuario = ?';
    const values = [nome, email, cep, logradouro, numero, complemento, bairro, cidade, uf, userId];
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
        res.json({ message: 'Perfil atualizado com sucesso!' });
    });
});

app.put('/perfil/senha', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { senhaAtual, novaSenha } = req.body;
    db.query('SELECT senha FROM usuario WHERE id_usuario = ?', [userId], async (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        const hashedDbPassword = results[0].senha;
        const isMatch = await bcrypt.compare(senhaAtual, hashedDbPassword);
        if (!isMatch) return res.status(400).json({ error: 'A senha atual está incorreta.' });
        const newHashedPassword = await bcrypt.hash(novaSenha, SALT_ROUNDS);
        db.query('UPDATE usuario SET senha = ? WHERE id_usuario = ?', [newHashedPassword, userId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao alterar a senha.' });
            res.json({ message: 'Senha alterada com sucesso!' });
        });
    });
});


// --- ROTAS PARA REDEFINIÇÃO DE SENHA ---
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ message: 'Se um utilizador com este email existir, um código foi enviado.' });
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const emailBody = `<p>O seu código de redefinição de senha é: <b>${code}</b>. Este código expira em 10 minutos.</p>`;
        const mailOptions = {
            from: '"MedResiduos" <manoelaps2022@gmail.com>', to: email,
            subject: "Código para Redefinição de Senha", html: emailBody,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(500).json({ error: 'Erro ao enviar o email.' });
            resetCodes[email] = { code, timestamp: Date.now() };
            res.json({ message: 'Se um utilizador com este email existir, um código foi enviado.' });
        });
    });
});

app.post('/validate-code', (req, res) => {
    const { email, code } = req.body;
    const storedInfo = resetCodes[email];
    if (!storedInfo || storedInfo.code !== code) return res.status(400).json({ error: 'Código inválido ou expirado.' });
    if (Date.now() - storedInfo.timestamp > 600000) { // 10 minutos
        delete resetCodes[email];
        return res.status(400).json({ error: 'Código expirado. Por favor, solicite um novo.' });
    }
    res.json({ message: 'Código validado com sucesso.' });
});

app.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    const storedInfo = resetCodes[email];
    if (!storedInfo || storedInfo.code !== code || (Date.now() - storedInfo.timestamp > 600000)) {
        return res.status(400).json({ error: 'A validação do código falhou. Por favor, tente o processo novamente.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        db.query('UPDATE usuario SET senha = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao redefinir a senha.' });
            delete resetCodes[email];
            res.json({ message: 'Senha redefinida com sucesso!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao processar a nova senha.' });
    }
});


// =================================================================
// ROTAS DE RESÍDUOS
// =================================================================
app.get('/residuos', (req, res) => {
  const { busca } = req.query;
  let query = 'SELECT * FROM residuo';
  const params = [];
  if (busca) {
    query += ' WHERE nome LIKE ? OR grupo LIKE ? OR acondicionamento LIKE ?';
    params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }
  query += ' ORDER BY nome';
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar resíduos.' });
    res.json(results);
  });
});

app.get('/residuos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM residuo WHERE id_residuo = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro interno no servidor.' });
    if (results.length === 0) return res.status(404).json({ error: 'Resíduo não encontrado.' });
    res.json(results[0]);
  });
});

app.post('/residuos', (req, res) => {
  const { nome, descricao, grupo, risco_especifico, estado_fisico, acondicionamento } = req.body;
  if (!nome || !grupo || !risco_especifico || !estado_fisico || !acondicionamento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  const query = 'INSERT INTO residuo (nome, descricao, grupo, risco_especifico, estado_fisico, acondicionamento) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nome, descricao, grupo, risco_especifico, estado_fisico, acondicionamento], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao cadastrar resíduo.' });
    res.status(201).json({ message: 'Resíduo cadastrado com sucesso!', id: result.insertId });
  });
});

app.put('/residuos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, grupo, risco_especifico, estado_fisico, acondicionamento } = req.body;
  if (!nome || !grupo || !risco_especifico || !estado_fisico || !acondicionamento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  const query = 'UPDATE residuo SET nome = ?, descricao = ?, grupo = ?, risco_especifico = ?, estado_fisico = ?, acondicionamento = ? WHERE id_residuo = ?';
  db.query(query, [nome, descricao, grupo, risco_especifico, estado_fisico, acondicionamento, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar resíduo.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Resíduo não encontrado.' });
    res.json({ message: 'Resíduo atualizado com sucesso!' });
  });
});

app.delete('/residuos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM residuo WHERE id_residuo = ?', [id], (err, result) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'Não é possível excluir. Este resíduo já está associado a uma entrega.' });
      }
      return res.status(500).json({ error: 'Erro ao excluir resíduo.' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Resíduo não encontrado.' });
    res.json({ message: 'Resíduo excluído com sucesso!' });
  });
});


// =================================================================
// ROTAS DE ENTREGA DE MATERIAIS
// =================================================================
app.get('/entregas', (req, res) => {
    const { busca } = req.query;
    let query = `
        SELECT 
            e.*,
            p.nome as paciente_nome,
            r.nome as residuo_nome
        FROM entrega_materiais e
        JOIN paciente p ON e.id_paciente = p.id_paciente
        JOIN residuo r ON e.id_residuo = r.id_residuo
    `;
    const params = [];
    if (busca) {
        query += ' WHERE p.nome LIKE ? OR r.nome LIKE ?';
        params.push(`%${busca}%`, `%${busca}%`);
    }
    query += ' ORDER BY e.data_entrega DESC';
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar entregas.' });
        res.json(results);
    });
});

app.get('/entregas/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM entrega_materiais WHERE id_entrega = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar entrega' });
        if (results.length === 0) return res.status(404).json({ error: 'Entrega não encontrada' });
        res.json(results[0]);
    });
});

app.post('/entregas', (req, res) => {
    const { id_paciente, id_residuo, quantidade, observacoes, data_prevista_devolucao, status } = req.body;
    if (!id_paciente || !id_residuo || !quantidade) {
        return res.status(400).json({ error: 'Paciente, resíduo e quantidade são obrigatórios.' });
    }
    const query = 'INSERT INTO entrega_materiais (id_paciente, id_residuo, quantidade, observacoes, data_entrega, data_prevista_devolucao, status) VALUES (?, ?, ?, ?, NOW(), ?, ?)';
    db.query(query, [id_paciente, id_residuo, quantidade, observacoes, data_prevista_devolucao, status || 'Aguardando Devolução'], (err, result) => {
        if (err) {
            console.error("Erro ao registrar entrega:", err);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
        
        // 3. USA O SINGLETON
        if (data_prevista_devolucao) {
             NotificationService.addNotification(
                'ENTREGA_COM_DEVOLUCAO',
                `Material entregue ao paciente ID ${id_paciente}. Devolução prevista para ${data_prevista_devolucao}.`,
                { pacienteId: id_paciente, residuoId: id_residuo, quantidade }
            );
        }

        res.status(201).json({ message: 'Entrega registrada com sucesso!', id: result.insertId });
    });
});

app.put('/entregas/:id', (req, res) => {
    const { id } = req.params;
    const { id_paciente, id_residuo, quantidade, observacoes, data_prevista_devolucao, status } = req.body;
    if (!id_paciente || !id_residuo || !quantidade) {
        return res.status(400).json({ error: 'Paciente, resíduo e quantidade são obrigatórios.' });
    }
    const query = 'UPDATE entrega_materiais SET id_paciente = ?, id_residuo = ?, quantidade = ?, observacoes = ?, data_prevista_devolucao = ?, status = ? WHERE id_entrega = ?';
    db.query(query, [id_paciente, id_residuo, quantidade, observacoes, data_prevista_devolucao, status, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar entrega' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Entrega não encontrada' });
        res.json({ message: 'Entrega atualizada com sucesso!' });
    });
});

app.delete('/entregas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM entrega_materiais WHERE id_entrega = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao excluir entrega' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Entrega não encontrada' });
        res.json({ message: 'Entrega excluída com sucesso!' });
    });
});


app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});