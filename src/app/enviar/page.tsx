import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import EnviarClient from "./EnviarClient";

export default async function EnviarPage() {
  const { data } = await supabaseServer.auth.getSession();
  const session = data?.session;

  // Se não estiver logado, manda pro login
  if (!session) {
    redirect("/login");
  }

  // Se estiver logado, mostra o formulário normalmente
  return <EnviarClient />;
}
