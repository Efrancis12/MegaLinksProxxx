import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Login realizado",
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro inesperado" },
      { status: 500 }
    );
  }
}
