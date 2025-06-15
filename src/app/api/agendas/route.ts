// src/app/api/agendas/route.ts
export async function GET() {
  const agendas = [
    { id: 1, nombre: 'Agenda 1', fecha: '2025-06-10' },
    { id: 2, nombre: 'Agenda 2', fecha: '2025-06-12' },
  ];

  return Response.json(agendas);
}
