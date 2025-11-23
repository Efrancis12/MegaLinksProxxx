"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginSignupPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Erro ao entrar. Tente novamente.");
      setLoading(false);
      return;
    }

    // login OK – manda para a página inicial (ajuste se quiser outro caminho)
    window.location.href = "/";
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    // cadastro OK – você pode pedir para confirmar e-mail, etc.
    alert("Conta criada! Verifique seu e-mail (se o Supabase estiver com confirmação ligada).");
    window.location.href = "/";
  }

  const onSubmit = mode === "login" ? handleLogin : handleSignup;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
            M
          </div>
          <h1 className="text-xl font-semibold text-slate-800">MegaLinksPro</h1>
          <p className="text-sm text-slate-500 text-center mt-1">
            {mode === "login"
              ? "Entre para gerenciar e divulgar seus grupos."
              : "Crie sua conta para começar a divulgar seus grupos."}
          </p>
        </div>

        {/* Tabs Entrar / Criar conta */}
        <div className="flex mb-4 border border-slate-200 rounded-full overflow-hidden text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-center ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-center ${
              mode === "signup"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            Criar conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processando..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
