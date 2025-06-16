// src/app/api/agendas/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3001/agendas');
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch('http://localhost:3001/agendas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
