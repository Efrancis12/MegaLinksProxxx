'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint =
        mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Erro ao processar a requisição.');
        return;
      }

      // aqui você decide pra onde mandar depois de logar/criar conta
      router.push('/'); // ou /dashboard, /grupos, etc.
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de rede ao falar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold mb-2">
            M
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            MegaLinksPro
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Crie sua conta para começar a divulgar seus grupos.
          </p>
        </div>

        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              mode === 'login'
                ? 'bg-white shadow text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              mode === 'signup'
                ? 'bg-white shadow text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            Criar conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading
              ? 'Processando...'
              : mode === 'signup'
              ? 'Criar conta'
              : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
