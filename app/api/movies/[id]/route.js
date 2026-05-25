import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const data = await readFile(filePath, 'utf8');
  const movies = JSON.parse(data);
  const movie = movies.find((item) => item.id === Number(params.id));

  if (!movie) {
    return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
  }

  return NextResponse.json(movie);
}
