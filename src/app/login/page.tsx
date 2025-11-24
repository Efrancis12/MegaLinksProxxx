"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // tenta ler o JSON, mas sem quebrar se vier vazio
      const body = await res
        .json()
        .catch(() => null as unknown as { error?: string });

      if (!res.ok) {
        setErrorMsg(
          body?.error ?? "Erro inesperado ao falar com o servidor."
        );
        return;
      }

      // sucesso
      if (mode === "signup") {
        setMode("login");
        setErrorMsg("Conta criada! Agora faça login.");
      } else {
        // ⬇️ AQUI AGORA MANDA PARA O PAINEL
        router.push("/painel");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Não foi possível se conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
            M
          </div>
        </div>

        <h1 className="text-center text-xl font-semibold text-gray-900 mb-1">
          MegaLinksPro
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Crie sua conta para começar a divulgar seus grupos.
        </p>

        <div className="flex mb-4 rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm rounded-full ${
              mode === "login"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm rounded-full ${
              mode === "signup"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Criar conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
