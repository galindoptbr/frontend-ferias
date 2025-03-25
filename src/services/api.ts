import axios from 'axios';

const API_URL = 'https://vacation-node-dp2yb3hh-galindoptbrs-projects.vercel.app';
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
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('[API] Resposta recebida de:', response.config.url);
    return response;
  },
  async (error) => {
    console.error('[API] Erro na requisição:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    if (!error.response) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }

    const errorMessage = error.response?.data?.message || 'Erro no servidor';
    throw new Error(errorMessage);
  }
);

export default api; 