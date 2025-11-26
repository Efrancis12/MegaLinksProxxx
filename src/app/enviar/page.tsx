"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGroupStore } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import {
  generateId,
  calculateExpirationDate,
  isValidEmail,
  isValidTelegramLink,
} from "@/lib/utils-groups";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function EnviarPage() {
  const router = useRouter();
  const { addGroup } = useGroupStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "" as Category,
    descricao: "",
    linkTelegram: "",
    emailDono: "",
  });

  // 🔒 Proteção via localStorage
  useEffect(() => {
    const flag =
      typeof window !== "undefined"
        ? localStorage.getItem("mlp-logged")
        : null;

    if (!flag) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.nome ||
      !formData.categoria ||
      !formData.descricao ||
      !formData.linkTelegram ||
      !formData.emailDono
    ) {
      toast.error("Por favor, preencha todos os campos");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.emailDono)) {
      toast.error("Email inválido");
      setIsSubmitting(false);
      return;
    }

    if (!isValidTelegramLink(formData.linkTelegram)) {
      toast.error("Link do Telegram inválido. Use o formato: t.me/seugrupo");
      setIsSubmitting(false);
      return;
    }

    const now = new Date();
    const expirationDate = calculateExpirationDate(now, 7);

    const newGroup = {
      id: generateId(),
      nome: formData.nome,
      categoria: formData.categoria,
      descricao: formData.descricao,
      linkTelegram: formData.linkTelegram,
      emailDono: formData.emailDono,
      dataCriacao: now.toISOString(),
      dataExpiracao: expirationDate.toISOString(),
      status: "ativo" as const,
      visualizacoes: 0,
    };

    addGroup(newGroup);

    toast.success("Grupo cadastrado com sucesso! 🎉", {
      description: "Seu anúncio está ativo por 7 dias grátis",
    });

    setTimeout(() => {
      router.push(`/grupo/${newGroup.id}`);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Cadastrar Grupo ou Canal
            </h1>
            <p className="text-gray-600 text-lg">
              Preencha os dados abaixo e comece a divulgar gratuitamente por 7 dias!
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Informações do Grupo/Canal</CardTitle>
              <CardDescription>Todos os campos são obrigatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Grupo/Canal *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Grupo de Tecnologia"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoria: value as Category,
                      })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva seu grupo ou canal..."
                    rows={5}
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descricao: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Mínimo 50 caracteres. Seja claro e atrativo!
                  </p>
                </div>

                {/* Link Telegram */}
                <div className="space-y-2">
                  <Label htmlFor="linkTelegram">Link do Telegram *</Label>
                  <Input
                    id="linkTelegram"
                    type="url"
                    placeholder="https://t.me/seugrupo"
                    value={formData.linkTelegram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        linkTelegram: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Use o formato: t.me/seugrupo ou telegram.me/seugrupo
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="emailDono">Seu Email *</Label>
                  <Input
                    id="emailDono"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.emailDono}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emailDono: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Usaremos para notificações importantes sobre seu anúncio
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">7 dias grátis!</p>
                      <p>
                        Seu anúncio ficará ativo por 7 dias sem custo. Após esse período,
                        você pode renovar escolhendo um de nossos planos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Cadastrando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Cadastrar Grupo Gratuitamente
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
