import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MyKey = process.env.REACT_APP_API_KEY

export default function MoviePage() {
const { movieId } = useParams()
  const [movieDetails, setMovieDetails] = useState(null)

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MyKey}&language=en-US`)
      .then(res => res.json())
      .then(json => {
        setMovieDetails(json)
      })
      .catch(err => console.error(err))
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
    </div>
    )
}