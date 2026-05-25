import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const data = await readFile(filePath, 'utf8');
  return NextResponse.json(JSON.parse(data));
}
