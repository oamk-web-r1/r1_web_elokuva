import { useState } from "react";
import { genres } from '../data/genres';

function SearchBar({ setQuery, setSelectedGenre, setSelectedYear, setSelectedAgeRating, isDisabled }) {
  const [localQuery, setLocalQuery] = useState('')
  const [visibleDropdown, setVisibleDropdown] = useState(null)

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)
  const ageRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17']

  const handleSearch = () => {
    if (!isDisabled) {
      setQuery(localQuery)
    }
  }

  const toggleDropdown = (dropdown) => {
    if (!isDisabled) {
      setVisibleDropdown((current) => (current === dropdown ? null : dropdown))
    }
  }

  const handleContainerClick = () => {
    if (isDisabled) {
      alert('You can only use the search bar on the home page!')
    }
  }

  return (
    <div className={`search-container ${isDisabled ? 'disabled' : ''}`}
    onClick={handleContainerClick}>
      <button class="search-button" onClick={handleSearch}>
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        disabled={isDisabled}
      />

      {/* Genre Filter */}
      <button className="filter-button" onClick={() => toggleDropdown('genre')} disabled={isDisabled}>Genre</button>
      {visibleDropdown === 'genre' && (
        <div className={`dropdown-menu ${visibleDropdown === 'genre' ? 'visible' : ''}`}>
          {genres.map(genre => (
            <div 
              key={genre.id}
              className="dropdown-item"
              onClick={() => {
                console.log("Genre button clicked")
                setSelectedGenre(genre.id)
                setVisibleDropdown(null)
              }}
            >
              {genre.name}
            </div>
          ))}
        </div>
      )}

      {/* Year Filter */}
      <button className="filter-button" onClick={() => toggleDropdown('year')} disabled={isDisabled}>Year</button>
      {visibleDropdown === 'year' && (
        <div className={`dropdown-menu ${visibleDropdown === 'year' ? 'visible' : ''}`}>
          {years.map(year => (
            <div 
              key={year}
              className="dropdown-item"
              onClick={() => {
                setSelectedYear(year)
                setVisibleDropdown(null)
              }}
            >
              {year}
            </div>
          ))}
        </div>
      )}

      {/* Age Rating Filter */}
      <button className="filter-button-corner" onClick={() => toggleDropdown('ageRating')} disabled={isDisabled}>Age Rating</button>
      {visibleDropdown === 'ageRating' && (
        <div className={`dropdown-menu ${visibleDropdown === 'ageRating' ? 'visible' : ''}`}>
          {ageRatings.map(rating => (
            <div 
              key={rating}
              className="dropdown-item"
              onClick={() => {
                setSelectedAgeRating(rating)
                setVisibleDropdown(null)
              }}
            >
              {rating}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar