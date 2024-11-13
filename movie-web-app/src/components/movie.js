import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

const MovieContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 100px;
  gap: 12px;
  justify-content: center;
  padding: 10px;
`;

const MovieCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 130px;
`;

const PosterImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
`;

const MovieTitle = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: #fff;
  text-align: center;
`;

function Movie({ movies }) {
  const [movieList, setMovieList] = useState([]);

  const getMovies = () => {
    fetch("https://api.themoviedb.org/3/movie/popular?api_key=22a1b5a6a4a47ee5d44b9905a6d233c0&language=en-US&page=1")
      .then(res => res.json())
      .then(json => setMovieList(json.results.slice(0, 9)))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (movies.length === 0) {
      getMovies();
    } else {
      setMovieList(movies);
    }
  }, [movies]);

  return (
    <MovieContainer>
      {movieList.map((movie) => (
        <MovieCard key={movie.id}>
          <PosterImage src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <MovieTitle>{movie.title}</MovieTitle>
        </MovieCard>
      ))}
    </MovieContainer>
  );
}

export default Movie;
