import { useState } from "react";
import '../stylesheet.css'
import searchicon from "../assets/searchicon.png";
import { genres } from '../data/genres';

const MyKey = process.env.REACT_APP_API_KEY

function SearchBar({ setResults }) {
  const [query, setQuery] = useState("")
  const [, setSelectedGenre] = useState(null)
  const [, setSelectedYear] = useState(null)
  const [, setSelectedAgeRating] = useState(null)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false)
  const [ageRatingDropdownVisible, setAgeRatingDropdownVisible] = useState(false)

  const BASE_URL = 'https://api.themoviedb.org/3'
  const searchURL = `${BASE_URL}/search/movie?api_key=${MyKey}&query=${query}&include_adult=false&language=en-US&page=1`

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)
  const ageRatings = ["G", "PG", "PG-13", "R", "NC-17"]
  
  const handleSearch = () => {
    if (query.trim() === "") return
    fetch(searchURL)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err))
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.id)
    setDropdownVisible(false)
    fetch(`${BASE_URL}/discover/movie?api_key=${MyKey}&language=en-US&with_genres=${genre.id}`)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err))
  }

  const handleYearSelect  = (year) => {
    setSelectedYear(year)
    setYearDropdownVisible(false)
    fetch(`${BASE_URL}/discover/movie?api_key=${MyKey}&language=en-US&primary_release_year=${year}`)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err))
  }

  const handleAgeRatingSelect  = (ageRating) => {
    setSelectedAgeRating(ageRating)
    setAgeRatingDropdownVisible(false)
    fetch(`${BASE_URL}/discover/movie?api_key=${MyKey}&language=en-US&certification_country=US&certification=${ageRating}`)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err))
  }

  return (
      <div class="search-container">
        <button class="search-button" onClick={handleSearch}>
          <img src={searchicon} alt="Search Icon" />
        </button>
        <input class="search-input"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button class="filter-button" onClick={() => setDropdownVisible(!isDropdownVisible)}>Genre</button>
        <div className={`dropdown-menu ${isDropdownVisible ? 'visible' : ''}`}>
          {genres.map((genre) => (
        <div className="dropdown-item" key={genre.id} onClick={() => handleGenreSelect(genre)}>
          {genre.name}
        </div>
       ))}
      </div>
      <button className="filter-button" onClick={() => setYearDropdownVisible(!yearDropdownVisible)}>Year</button>
      <div className={`dropdown-menu ${yearDropdownVisible ? 'visible' : ''}`}>
        {years.map((year) => (
          <div
            className="dropdown-item"
            key={year}
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </div>
        ))}
      </div>
      <button className="filter-button-2" onClick={() => setAgeRatingDropdownVisible(!ageRatingDropdownVisible)}>Age Rating</button>
      <div className={`dropdown-menu ${ageRatingDropdownVisible ? 'visible' : ''}`}>
        {ageRatings.map((rating) => (
          <div
            className="dropdown-item"
            key={rating}
            onClick={() => handleAgeRatingSelect(rating)}
          >
            {rating}
          </div>
        ))}
      </div>
      </div>
  )
}

export default SearchBar

