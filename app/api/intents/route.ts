
import { NextResponse } from 'next/server';
import intents from '@/data/intents.json';

export async function GET() {
  return NextResponse.json(intents);
}
