'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href={isAuthenticated ? '/dashboard' : '/'} 
            className="text-xl font-bold hover:text-blue-200"
          >
            Sistema de Férias
          </Link>

          {/* Container central para as opções */}
          <div className="flex-1 flex justify-center items-center">
            {isAuthenticated && (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="hover:text-blue-200">
                  Minhas Férias
                </Link>
                <Link href="/ferias/nova" className="hover:text-blue-200">
                  Nova Solicitação
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin" className="hover:text-blue-200">
                    Painel Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Container para o perfil/login */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div className="font-medium">{user?.nome}</div>
                  <div className="text-blue-200">{user?.cargo}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  href="/login"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}