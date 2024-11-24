import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/useUser';
import axios from 'axios';

const MyKey = process.env.REACT_APP_API_KEY

export default function MoviePage() {
  const { user } = useUser()
  const { movieId } = useParams()
  const [movieDetails, setMovieDetails] = useState(null)
  const [tmdbReviews, setTmdbReviews] = useState([])
  const [localReviews, setLocalReviews] = useState([])
  const [newReview, setNewReview] = useState({ content: '', rating: '' })

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
      .catch(err => console.error(err))
  }, [movieId])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      review_text: newReview.content,
      imdb_movie_id: movieId,
      rating: newReview.rating,
    }

    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      }
      await axios.post(`http://localhost:3001/reviews/${movieId}`, payload, headers)

      // Fetch updated reviews after posting
      fetch(`http://localhost:3001/reviews/${movieId}`)
        .then(res => res.json())
        .then(json => setLocalReviews(json.reviews))
        .catch(err => console.error(err));

      // Clear the form
      setNewReview({ content: '', rating: '' })
    } catch (err) {
      console.error('Error posting review:', err)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3001/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      // Update local reviews after deleting
      setLocalReviews(prev => prev.filter(review => review.id !== reviewId))
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }
  
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
      {user.token ? (
        <div class="post-review">
          <h2>Write a review</h2>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              placeholder="Write your review..."
              required
            ></textarea>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              required
            >
              <option value="" disabled>Rating</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <button type="submit">Post</button>
          </form>
        </div>
      ) : (
        <p>You need to be logged in to post a review.</p>
      )}
      <div class="review-container">
      <h2>Reviews</h2>
        {localReviews.length > 0 && (
          localReviews.map(review => (
            <div key={review.id} class="review">
              <p><strong>{review.author}:</strong> {review.content}</p>
              {review.rating && <p><strong>Rating:</strong> {review.rating}</p>}
              {review.author === user.email && (
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              )}
            </div>
          ))
        )}
        {tmdbReviews.length > 0 && (
          tmdbReviews.map(review => (
            <div key={review.id} class="review">
              <p><strong>{review.author}:</strong> {review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
    )
  }