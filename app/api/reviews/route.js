import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'reviews.json');

async function getReviews() {
  const data = await readFile(filePath, 'utf8');
  return JSON.parse(data);
}

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request) {
  const body = await request.json();
  const reviews = await getReviews();
  const newReview = {
    id: Date.now(),
    movie: body.movie,
    name: body.name,
    score: Number(body.score),
    comment: body.comment,
  };
  reviews.unshift(newReview);
  await writeFile(filePath, JSON.stringify(reviews, null, 2));
  return NextResponse.json(newReview, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  const reviews = await getReviews();
  const updatedReviews = reviews.filter((review) => review.id !== id);
  await writeFile(filePath, JSON.stringify(updatedReviews, null, 2));
  return NextResponse.json({ message: 'Review deleted' });
}
