import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('[API] Inicializando com URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  console.log('[API] Fazendo requisição para:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Adiciona o origin no header para debug
  config.headers['Origin'] = window.location.origin;
  return config;
}, (error) => {
  console.error('[API] Erro na configuração da requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('[API] Resposta recebida de:', response.config.url);
    return response;
  },
  async (error) => {
    // Log detalhado do erro
    console.error('[API] Erro detalhado:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      headers: error.config?.headers,
      data: error.response?.data
    });

    if (!error.response) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }

    const errorMessage = error.response?.data?.message || 'Erro no servidor';
    throw new Error(errorMessage);
  }
);

export default api; 