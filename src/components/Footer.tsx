import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#4012A1] via-[#4012A1] to-[#E86E2F] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <Image 
                  src={logo} 
                  alt="Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">Vertsa Ferias</h2>
            </div>
            <p className="text-gray-200 max-w-[300px]">
              Sistema de gerenciamento de férias para funcionários. Simplifique o processo de solicitação e aprovação de férias.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-200 hover:text-white transition-colors">
                  Minhas Férias
                </Link>
              </li>
              <li>
                <Link href="/ferias/nova" className="text-gray-200 hover:text-white transition-colors">
                  Nova Solicitação
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-200 hover:text-white transition-colors">
                  Painel Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-200">
              <li>suporte@vertsa.com</li>
              <li>(11) 1234-5678</li>
              <li>Porto, Portugal</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-400 mt-8 pt-4 text-center text-gray-200">
          <p className='text-sm'>&copy; {new Date().getFullYear()} Vertsa Ferias. <br /> Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 