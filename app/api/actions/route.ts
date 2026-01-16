
import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'actions.json');

function readActions() {
  try {
    const raw = readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json(readActions());
}

export async function POST(req: Request) {
  const body = await req.json();
  const actions = readActions();

  if (body?.op === 'updateStatus') {
    const { id, status } = body;
    const updated = actions.map((a: any) => a.id === id ? { ...a, status } : a);
    writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  }

  if (body?.op === 'create') {
    const action = body.action;
    const updated = [{ ...action }, ...actions];
    writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, id: action.id });
  }

  return NextResponse.json({ ok: false, error: 'Unsupported op' }, { status: 400 });
}
