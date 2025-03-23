import api from './api';

interface LoginData {
  email: string;
  senha: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

interface User {
  id: string;
  nome: string;
  cargo: string;
  isAdmin: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private user: User | null = null;

  async loginWithCredentials(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    this.setAuthData(response.data.token, response.data.user);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    this.setAuthData(response.data.token, response.data.user);
    return response.data;
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const response = await api.patch<User>(`/api/auth/promote/${userId}`);
    return response.data;
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  private setUser(user: User): void {
    if (typeof window === 'undefined') return;
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    this.clearToken();
    localStorage.removeItem('user');
    this.user = null;
  }

  private setAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    this.setToken(token);
    this.setUser(user);
  }
}

export const authService = new AuthService();