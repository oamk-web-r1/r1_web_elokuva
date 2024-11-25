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
      <>
        <div class="movie-detail-container">
      {movieDetails && (
        <>
          <img class="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
          alt={movieDetails.title}
      />
      <div>
        <h1 class="default-big-title-white">{movieDetails.title}</h1>
        <p>{movieDetails.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Rating:</strong>
        <span class="movie-rating">
          <i class="fa fa-star"></i> {movieDetails.vote_average}
          </span></p>
        <p>{movieDetails.overview}</p>
        <p>{movieDetails.release_date}</p>
      </div>
      </>
      )}
      </div>

      {user.token ? (
        <div class="post-review">
          <div class="post-review-title">
            <h2>Write a review</h2>
            <div class="review-stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <i
              key={num}
              class={`fa fa-star ${num <= newReview.rating ? 'active' : ''}`}
              onClick={() => setNewReview({ ...newReview, rating: num })}
            ></i>
        ))}
      </div>
    </div>
    <form onSubmit={handleReviewSubmit}>
      <div class="review-box-container">
        <div>
          <i class="fa fa-user-circle" style={{ fontSize: '2rem', color: '#fff' }}></i>
        </div>
        <textarea
          class="review-box"
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          placeholder="Write your review..."
          required
        ></textarea>
      </div>
      <div class="post-review-button-container">
        <button class="default-button-pink" type="submit">Post</button>
      </div>
    </form>
  </div>
      ) : (
        <p>You need to be logged in to post a review.</p>
      )}
      
    <div class="review-container">
      <h2 class="default-medium-title">Reviews</h2>
        {localReviews.length > 0 && (
          localReviews.map(review => (
            <div key={review.id} class="review">
              <div class="review-header">
                <strong>{review.author}</strong>
                <span>{review.rating && `⭐ ${review.rating}`}</span>
            </div>
            <p class="default-text">{review.content}</p>
            {review.author === user.email && (
              <div class="delete-button-container">
                <button class="delete-button"
                onClick={() => handleDeleteReview(review.id)}>Delete
                </button>
            </div>
          )}
          </div>
          ))
        )}
        {tmdbReviews.length > 0 && (
          tmdbReviews.map(review => (
            <div key={review.id} class="review">
              <div class="review-header">
                <strong>{review.author}</strong>
                <span>⭐</span>
              </div><p class="default-text">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </>
    )
  }