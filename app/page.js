'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const genres = ['All', 'Action', 'Animation', 'Drama', 'Romance', 'Sci-Fi', 'Thriller'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('highest');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [name, setName] = useState('');
  const [score, setScore] = useState('5');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      const movieRes = await fetch('/api/movies');
      const reviewRes = await fetch('/api/reviews');
      const movieData = await movieRes.json();
      const reviewData = await reviewRes.json();
      setMovies(movieData);
      setSelectedMovie(movieData[0]);
      setReviews(reviewData);
    }
    loadData();
  }, []);

  const filteredMovies = useMemo(() => {
    let list = movies.filter((movie) => {
      const matchSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = genre === 'All' || movie.genre === genre;
      return matchSearch && matchGenre;
    });
    if (sort === 'highest') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [movies, search, genre, sort]);

  async function addReview(e) {
    e.preventDefault();
    if (!selectedMovie) return;
    if (!name.trim() || !comment.trim()) return alert('Please fill name and review.');

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movie: selectedMovie.title,
        name,
        score,
        comment,
      }),
    });
    const newReview = await res.json();
    setReviews([newReview, ...reviews]);
    setName('');
    setScore('5');
    setComment('');
  }

  async function deleteReview(id) {
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
    setReviews(reviews.filter((review) => review.id !== id));
  }

  return (
    <main className="page">
      <section className="hero simple-hero">
        <div className="brand">
          <div className="logo">🎬</div>
          <div>
            <h1>CineRate</h1>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="toolbar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movie name..." />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="highest">Highest Rating</option>
            <option value="newest">Newest Year</option>
          </select>
        </div>

        <div className="grid">
          {filteredMovies.map((movie) => (
            <article className="movie-card" key={movie.id}>
              <div className="poster" style={{ backgroundImage: `url(${movie.poster})` }}>
                <span className="badge">{movie.genre}</span>
                <span className="rating">⭐ {movie.rating}</span>
              </div>
              <div className="content">
                <h3>{movie.title}</h3>
                <div className="meta"><span>{movie.year}</span><span>{movie.genre}</span></div>
                <p className="desc">{movie.desc}</p>
                <div className="actions">
                  <button className="btn primary" onClick={() => setSelectedMovie(movie)}>Review This</button>
                  <Link className="btn secondary" href={`/movies/${movie.id}`}>Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredMovies.length === 0 && <div className="empty">No movies found.</div>}

        <section className="review-panel">
          <h2>Write Review for: {selectedMovie ? selectedMovie.title : 'Loading...'}</h2>
          <form className="form" onSubmit={addReview}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <select value={score} onChange={(e) => setScore(e.target.value)}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your movie review..." />
            <button className="btn primary">Add Review</button>
          </form>

          <div className="reviews">
            {reviews.map((review) => (
              <div className="review" key={review.id}>
                <div>
                  <strong>{review.movie}</strong> — {review.name} ⭐ {review.score}
                  <p>{review.comment}</p>
                </div>
                <button className="btn delete" onClick={() => deleteReview(review.id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </section>
      <footer className="footer">© 2026 CineRate</footer>
    </main>
  );
}
