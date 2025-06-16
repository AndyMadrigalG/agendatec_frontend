import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch('http://localhost:3001/puntos', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
