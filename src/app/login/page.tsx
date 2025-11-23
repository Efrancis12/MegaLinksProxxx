'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setErrorMsg('Informe e-mail e senha.');
        return;
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        // opção: redirecionar pro painel depois do cadastro
        router.push('/panel');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        router.push('/panel');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro ao comunicar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          padding: 32,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '9999px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, #6366f1, #3b82f6)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            M
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 4,
              color: '#111827',
            }}
          >
            MegaLinksPro
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            {mode === 'login'
              ? 'Entre para gerenciar e divulgar seus grupos.'
              : 'Crie sua conta para começar a divulgar seus grupos.'}
          </p>
        </div>

        {/* Botões de alternância Login / Cadastro */}
        <div
          style={{
            display: 'flex',
            marginBottom: 20,
            background: '#f3f4f6',
            borderRadius: 999,
            padding: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              borderRadius: 999,
              border: 'none',
              padding: '8px 0',
              fontSize: 14,
              cursor: 'pointer',
              background:
                mode === 'login' ? '#fff' : 'transparent',
              fontWeight: mode === 'login' ? 600 : 500,
              color: mode === 'login' ? '#111827' : '#6b7280',
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              borderRadius: 999,
              border: 'none',
              padding: '8px 0',
              fontSize: 14,
              cursor: 'pointer',
              background:
                mode === 'signup' ? '#fff' : 'transparent',
              fontWeight: mode === 'signup' ? 600 : 500,
              color: mode === 'signup' ? '#111827' : '#6b7280',
            }}
          >
            Criar conta
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 13,
              color: '#b91c1c',
              marginBottom: 16,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 4,
                color: '#374151',
              }}
            >
              Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                padding: '8px 10px',
                background: '#f9fafb',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: '#9ca3af',
                  marginRight: 8,
                }}
              >
                @
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  color: '#111827',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 4,
                color: '#374151',
              }}
            >
              Senha
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                padding: '8px 10px',
                background: '#f9fafb',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: '#9ca3af',
                  marginRight: 8,
                }}
              >
                🔒
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  color: '#111827',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: '100%',
              borderRadius: 999,
              border: 'none',
              padding: '10px 0',
              cursor: loading ? 'default' : 'pointer',
              fontSize: 15,
              fontWeight: 600,
              color: '#fff',
              background:
                'linear-gradient(135deg, #6366f1, #3b82f6)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? mode === 'login'
                ? 'Entrando...'
                : 'Criando conta...'
              : mode === 'login'
              ? 'Entrar'
              : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
