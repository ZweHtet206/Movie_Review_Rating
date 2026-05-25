import Link from 'next/link';
import '../../../app/globals.css';

async function getMovie(id) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/movies/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function MovieDetails({ params }) {
  const movie = await getMovie(params.id);

  if (!movie) {
    return (
      <main className="page detail-page">
        <section className="detail-wrap">
          <h1>Movie Not Found</h1>
          <Link className="btn primary" href="/">Back Home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page detail-page">
      <section className="detail-wrap">
        <Link className="back-link" href="/">← Back to Movies</Link>
        <div className="detail-card">
          <div className="detail-poster" style={{ backgroundImage: `url(${movie.poster})` }}></div>
          <div className="detail-info">
            <span className="badge inline-badge">{movie.genre}</span>
            <h1>{movie.title}</h1>
            <div className="detail-meta">
              <span>Year: {movie.year}</span>
              <span>Rating: ⭐ {movie.rating}</span>
              <span>Duration: {movie.duration}</span>
            </div>
            <h3>Movie Details</h3>
            <p>{movie.details}</p>
            <div className="info-list">
              <p><strong>Director:</strong> {movie.director}</p>
              <p><strong>Cast:</strong> {movie.cast}</p>
              <p><strong>Short Review:</strong> {movie.desc}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
