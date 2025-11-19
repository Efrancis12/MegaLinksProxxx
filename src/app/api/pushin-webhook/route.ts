import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook recebido:", body);

    const event = body.event;
    const data = body.data;

    // Confirma se é notificação válida
    if (!event || !data) {
      return NextResponse.json({ ok: false });
    }

    // Quando um pagamento é aprovado
    if (event === "payment.updated" && data.status === "approved") {
      // custom_id -> "plano_basico|email@email.com"
      const [plano, email] = (data.custom_id || "").split("|");

      console.log("Pagamento aprovado para:", email, "Plano:", plano);

      // 🔥 Aqui você libera o plano no seu banco de dados
      // exemplo fictício:
      // await prisma.user.update({
      //   where: { email },
      //   data: { planoAtivo: plano }
      // });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return NextResponse.json({ ok: false });
  }
}
