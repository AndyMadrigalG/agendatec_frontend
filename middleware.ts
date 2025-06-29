import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/Constants/lib';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}