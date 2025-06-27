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

export async function cadastrarPaciente(pacienteData) {
  const response = await fetch(`${API_URL}/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacienteData)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Erro ao cadastrar paciente.');
  }
  return result;
}

export async function getPacientes() {
  const response = await fetch(`${API_URL}/pacientes`);
  if (!response.ok) {
    throw new Error('Falha ao buscar a lista de pacientes.');
  }
  return response.json();
}

export async function getPacienteById(id) {
  const response = await fetch(`${API_URL}/pacientes/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar dados do paciente.');
  }
  return response.json();
}

export async function updatePaciente(id, pacienteData) {
  const response = await fetch(`${API_URL}/pacientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacienteData)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Erro ao atualizar paciente.');
  }
  return result;
}

export async function deletePaciente(id) {
  const response = await fetch(`${API_URL}/pacientes/${id}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Erro ao deletar paciente.');
  }
  return result;
}