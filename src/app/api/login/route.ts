import { handleLogin } from "@/app/(inicioSesion)/login/actions";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await handleLogin(formData);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error en el login:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error en el servidor" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}