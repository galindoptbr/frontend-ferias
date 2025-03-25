'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { FiLogOut } from 'react-icons/fi';

import logo from '../../public/logo.png';
import userImage from '../../public/user.png';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#4012A1] via-[#4012A1] to-[#E86E2F] text-white shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link 
            href={isAuthenticated ? '/dashboard' : '/'} 
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Image 
                src={logo} 
                alt="Logo" 
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-white">
              Vertsa Ferias
            </h1>
          </Link>

          {/* Container central para as opções */}
          <div className="flex-1 flex justify-center items-center">
            {isAuthenticated && (
              <div className="flex items-center gap-8">
                <Link 
                  href="/dashboard" 
                  className="text-white transition-colors duration-300 relative group"
                >
                  Minhas Férias
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/ferias/nova" 
                  className="text-white transition-colors duration-300 relative group"
                >
                  Nova Solicitação
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user?.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-white transition-colors duration-300 relative group"
                  >
                    Painel Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Container para o perfil/login */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={userImage}
                      alt="Foto do usuário"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">{user?.nome}</div>
                    <div className="text-blue-200 text-sm">{user?.cargo}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <FiLogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login"
                  className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-white px-6 py-2 rounded-full text-[#5e17eb] hover:bg-blue-50 transition-all duration-300 font-medium"
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