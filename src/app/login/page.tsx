'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();

  // modo inicial: signup (Criar Conta)
  const [mode, setMode] = useState<'login' | 'signup'>('signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // se o usuário já estiver logado, manda para o painel
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push('/painel');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log('signup result', { data, error });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        router.push('/painel');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('login result', { data, error });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        router.push('/painel');
      }
    } catch (err: any) {
      console.error('Erro inesperado no auth:', err);
      setErrorMsg(
        err?.message || 'Erro inesperado ao comunicar com o servidor.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Logo / título */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500 text-2xl">✈</span>
            <span className="font-semibold text-xl text-blue-700">
              MegaLinksPro
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignup ? 'Criar Conta' : 'Entrar'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {isSignup
              ? 'Cadastre-se para começar a divulgar seus grupos.'
              : 'Entre para gerenciar e divulgar seus grupos.'}
          </p>
        </div>

        {/* Mensagem de erro */}
        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <span className="text-gray-400 mr-2">📧</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full bg-transparent outline-none text-sm text-gray-800"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
