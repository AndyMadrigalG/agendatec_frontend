"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');
    }, [router]);

    return null; // No retorna ningun contenido porque se redirige automáticamente a /login
}
