import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Log da requisição para debug
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });

    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    // Log da resposta para debug
    console.log(`[API Response] ${response.status}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Erro de rede (sem conexão com o servidor)
      if (!error.response) {
        console.error('[Network Error] Não foi possível conectar ao servidor');
        return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'));
      }

      // Erro de autenticação
      if (error.response.status === 401) {
        // Não redireciona se for a rota de login
        if (!error.config?.url?.includes('/api/auth/login')) {
          authService.logout();
          window.location.href = '/login';
          return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
        }
        return Promise.reject(error);
      }

      // Erro de permissão
      if (error.response.status === 403) {
        return Promise.reject(new Error('Você não tem permissão para realizar esta ação.'));
      }
    }

    return Promise.reject(error);
  }
);

export default api; 