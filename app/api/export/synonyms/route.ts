
import { NextResponse } from 'next/server';
import details from '@/data/intentDetails.json';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const intentId = searchParams.get('intentId') || '';
  // @ts-ignore
  const d = details[intentId];
  const payload = d?.recommendations?.synonyms ?? [];
  return new NextResponse(JSON.stringify({ intentId, synonyms: payload }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="${intentId || 'synonyms'}.json"`
    }
  });
}
