"use client";

import Link from "next/link";
import { Send, Mail, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Send className="w-6 h-6 text-blue-500" />
              MegaLinksPro
            </Link>
            <p className="text-sm text-gray-400">
              A melhor plataforma para divulgar grupos e canais do Telegram. 
              Ganhe mais membros com facilidade!
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/grupos" className="hover:text-blue-400 transition-colors">
                  Todos os Grupos
                </Link>
              </li>
              <li>
                <Link href="/planos" className="hover:text-blue-400 transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link href="/enviar" className="hover:text-blue-400 transition-colors">
                  Cadastrar Grupo
                </Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-blue-400 transition-colors">
                  Meu Painel
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contato@megalinkspro.com" 
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MegaLinksPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
