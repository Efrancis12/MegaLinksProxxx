"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!email || !password) {
        toast.error("Preencha email e senha");
        setIsSubmitting(false);
        return;
      }

      if (tab === "login") {
        // 🔐 LOGIN via rota /api/auth/login já existente
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Erro ao fazer login");
          setIsSubmitting(false);
          return;
        }

        // ✅ MARCA COMO LOGADO NO NAVEGADOR
        if (typeof window !== "undefined") {
          localStorage.setItem("mlp-logged", "true");
        }

        toast.success("Login realizado com sucesso!");
        router.push("/painel");
      } else {
        // 🆕 CRIAR CONTA (se você quiser usar sua API de signup aqui depois)
        toast.info("Cadastro de conta ainda não implementado nesta tela.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      toast.error("Erro inesperado. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xl mb-3">
            M
          </div>
          <h1 className="text-xl font-semibold mb-1">MegaLinksPro</h1>
          <p className="text-sm text-gray-500 text-center">
            Crie sua conta para começar a divulgar seus grupos.
          </p>
        </div>

        {/* Abas Entrar / Criar conta (visual) */}
        <div className="flex mb-6 bg-gray-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-full ${
              tab === "login"
                ? "bg-violet-600 text-white shadow"
                : "text-gray-500"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-sm font-medium rounded-full ${
              tab === "signup"
                ? "bg-violet-600 text-white shadow"
                : "text-gray-500"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? tab === "login"
                ? "Entrando..."
                : "Criando conta..."
              : tab === "login"
              ? "Entrar"
              : "Criar conta"}
          </Button>
        </form>
      </div>
    </main>
  );
}
