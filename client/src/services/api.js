export const API_URL = 'http://localhost:3001';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }
  return response.json();
}

export async function getUsuarios() {
  const response = await fetch(`${API_URL}/usuarios`);
  if (!response.ok) {
    throw new Error('Falha ao buscar usuários da API');
  }
  return response.json();
}

export async function cadastrarUsuario(nome, email, senha, tipoUsuario) {
  // Pega o tipo do usuário que está LOGADO para enviar como permissão
  const adminRole = localStorage.getItem('tipoUsuario');

  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Envia a permissão do usuário logado no cabeçalho
      'x-user-role': adminRole
    },
    // Envia os dados do NOVO usuário no corpo
    body: JSON.stringify({ nome, email, senha, tipoUsuario })
  });
  
  // Tratamento de erros melhorado
  const contentType = response.headers.get('content-type');
  if (!response.ok) {
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || `Erro ${response.status}`);
    } else {
      // Se a resposta não for JSON, mostra o texto (que pode ser o erro HTML)
      const textError = await response.text();
      throw new Error('Erro inesperado do servidor: ' + textError);
    }
  }
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  // Retorno padrão para o caso de a resposta ser 201 Created sem corpo JSON
  return { message: 'Operação bem-sucedida' };
}
// Função para buscar um usuário pelo ID
export async function getUsuarioById(id) {
  const response = await fetch(`${API_URL}/usuarios/${id}`);
  if (!response.ok) throw new Error('Falha ao buscar dados do usuário');
  return response.json();
}

// Função para atualizar um usuário
export async function updateUsuario(id, usuarioData) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Falha ao atualizar usuário');
  }
  return response.json();
}

export async function deleteUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao deletar usuário');
    }
    // Não precisamos retornar nada se for sucesso, a resposta vazia já basta
    return true; 
  } catch (error) {
    console.error('Erro na chamada para deletar usuário:', error);
    throw error;
  }
}