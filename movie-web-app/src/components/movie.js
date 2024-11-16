import React, { useEffect, useState } from 'react'
import '../stylesheet.css'
import { Link } from 'react-router-dom';
//um

const MyKey = process.env.REACT_APP_API_KEY

function Movie({ movies }) {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getMovies = (page) => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${MyKey}&language=en-US&page=${page}`)
      .then(res => res.json())
      .then(json => {
        setMovieList(json.results)
        setTotalPages(json.total_pages)
      })
      .catch(err => console.error(err))
  };

  useEffect(() => {
    if (movies.length === 0) {
      getMovies(currentPage)
    }
      else {
        setMovieList(movies)
      }
  }, [currentPage, movies])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <>
    <div class="movie-container">
      {
      movieList.map((movie) => (
        <div class="movie-card" key={movie.id}>
          <Link to={`/moviepage/${movie.id}`}> 
          <img class="poster-image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          </Link>
          <p class="movie-title">{movie.title}</p>
        </div>
      ))}
    </div>
    <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  )
}

export default Movie

