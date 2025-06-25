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

export async function cadastrarUsuario(nome, email, senha, tipoUsuario) {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, tipoUsuario })
  });
  const contentType = response.headers.get('content-type');
  if (!response.ok) {
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao cadastrar usuário');
    } else {
      throw new Error('Erro inesperado no servidor');
    }
  }
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    throw new Error('Resposta inesperada do servidor');
  }
}

// ... (depois da função cadastrarUsuario)

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