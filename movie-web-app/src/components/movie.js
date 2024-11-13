import React, { useEffect, useState } from 'react'
import '../stylesheet.css'

function Movie({ movies }) {
  const [movieList, setMovieList] = useState([]);

  const getMovies = () => {
    fetch("https://api.themoviedb.org/3/movie/popular?api_key=22a1b5a6a4a47ee5d44b9905a6d233c0&language=en-US&page=1")
      .then(res => res.json())
      .then(json => setMovieList(json.results.slice(0, 9)))
      .catch(err => console.error(err))
  };

  useEffect(() => {
    if (movies.length === 0) {
      getMovies();
    } else {
      setMovieList(movies)
    }
  }, [movies])

  return (
    <div class="movie-container">
      {movieList.map((movie) => (
        <div class="movie-card" key={movie.id}>
          <img class="poster-image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <p class="movie-title">{movie.title}</p>
        </div>
      ))}
    </div>
  )
}

export default Movie
