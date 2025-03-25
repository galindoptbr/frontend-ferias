import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log da URL base para debug
console.log('[API] URL Base:', process.env.NEXT_PUBLIC_API_URL);

// Interceptor para adicionar o token e origin em todas as requisições
api.interceptors.request.use((config) => {
  // Adiciona o token se existir
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Adiciona o origin correto
  if (typeof window !== 'undefined') {
    config.headers.Origin = window.location.origin;
  }

  // Log da requisição para debug
  console.log('[API] Requisição:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });

  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Log detalhado do erro
    console.error('[API] Erro:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });

    if (!error.response) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }

    throw error;
  }
);

export default api; 