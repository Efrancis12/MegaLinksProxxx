import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import EnviarClient from "./EnviarClient";

export default async function EnviarPage() {
  const { data } = await supabaseServer.auth.getSession();
  const session = data?.session;

  // Se não estiver logado, redireciona para /login
  if (!session) {
    redirect("/login");
  }

  // Se estiver logado, carrega o componente Client
  return <EnviarClient />;
}
