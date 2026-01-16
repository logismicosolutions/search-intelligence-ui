
import { NextResponse } from 'next/server';
import intents from '@/data/intents.json';
import details from '@/data/intentDetails.json';
import actions from '@/data/actions.json';

export async function GET() {
  const payload = { intents, details, actions, generatedAt: new Date().toISOString() };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': 'attachment; filename="search-intelligence-export.json"'
    }
  });
}
