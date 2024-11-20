import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MyKey = process.env.REACT_APP_API_KEY

export default function MoviePage() {
  const { movieId } = useParams()
  const [movieDetails, setMovieDetails] = useState(null)
  const [tmdbReviews, setTmdbReviews] = useState([])
  const [localReviews, setLocalReviews] = useState([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MyKey}&language=en-US`)
      .then(res => res.json())
      .then(json => {
        setMovieDetails(json)
      })
      .catch(err => console.error(err))
  }, [movieId])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${MyKey}&language=en-US&page=1`)
    .then(res => res.json())
    .then(json => {
      setTmdbReviews(json.results)
    })
    .catch(err => console.error(err))
  }, [movieId])

  useEffect(() => {
    fetch(`http://localhost:3001/reviews/${movieId}`)
      .then(res => res.json())
      .then(json => {
        setLocalReviews(json.reviews)
      })
      .catch(err => console.error('Error fetching local reviews:', err))
  }, [movieId])

    return (
        <div class="movie-detail-container">
      {movieDetails && (
        <>
          <h1>{movieDetails.title}</h1>
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}/>
          <p><strong>Rating:</strong> {movieDetails.vote_average}</p>
          <p><strong>Genres:</strong> {movieDetails.genres.map(genre => genre.name).join(', ')}</p>
          <p><strong>Description:</strong> {movieDetails.overview}</p>
          <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
        </>
      )}
      <div class="review-container">
      <h2>Reviews</h2>
        {localReviews.length > 0 && (
          localReviews.map(review => (
            <div key={review.id} class="review">
              <p><strong>{review.author}:</strong> {review.content}</p>
              {review.rating && <p><strong>Rating:</strong> {review.rating}</p>}
            </div>
          ))
        )}

        {tmdbReviews.length > 0 && (
          tmdbReviews.map(review => (
            <div key={review.id} className="review">
              <p><strong>{review.author}:</strong> {review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
    )
  }
