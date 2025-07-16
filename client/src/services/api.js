// src/services/api.js
export const API_URL = 'http://localhost:3001';

// --- Helper para montar os cabeçalhos de autenticação ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};


// --- FUNÇÕES DA API ---

export async function login(email, password, lembrarMe) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Adiciona o 'lembrarMe' ao corpo da requisição
    body: JSON.stringify({ email, password, lembrarMe }) 
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }
  return response.json();
}

export async function getUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`, {
        headers: getAuthHeaders() // Usa o helper
    });
    if (!response.ok) throw new Error('Falha ao buscar usuários');
    return response.json();
}

export async function getUsuarioById(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        headers: getAuthHeaders() // Usa o helper
    });
    if (!response.ok) throw new Error('Falha ao buscar dados do usuário');
    return response.json();
}

// A função de cadastro agora não precisa mais do 'x-user-role'
// porque o backend vai validar o token.
export async function cadastrarUsuario(usuarioData) {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: getAuthHeaders(), // Usa o helper
        body: JSON.stringify(usuarioData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao cadastrar usuário');
    }
    return response.json();
}

export async function updateUsuario(id, usuarioData) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Usa o helper
        body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar usuário');
    }
    return response.json();
}

export async function deleteUsuario(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // Usa o helper
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar usuário');
    }
    return true;
}

export async function getMeuPerfil() {
    const response = await fetch(`${API_URL}/perfil`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Falha ao buscar dados do perfil');
    return response.json();
}

export async function updateMeuPerfil(profileData) {
    const response = await fetch(`${API_URL}/perfil`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar o perfil');
    }
    return response.json();
}

export async function updateMinhaSenha(passwordData) {
    const response = await fetch(`${API_URL}/perfil/senha`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao alterar a senha');
    }
    return response.json();
}