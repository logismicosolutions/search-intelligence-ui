
import { NextResponse } from 'next/server';
import details from '@/data/intentDetails.json';

export async function GET(_: Request, { params }: { params: { intentId: string } }) {
  const intentId = params.intentId;
  // @ts-ignore
  const intent = details[intentId];
  if (!intent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(intent);
}
