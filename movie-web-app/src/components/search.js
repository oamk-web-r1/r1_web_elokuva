import { useState } from "react";
import styled from "styled-components";
import searchicon from "../assets/searchicon.png";
import { genres } from '../data/genres';

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 500px;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
`;

const FilterButton = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: white;
  color: black;
  border-radius: 0 4px 4px 0;
  cursor: pointer;

  &:hover {
    color: #CA2145;
  }
`;

const SearchButton = styled.button`
  display: flex;
  padding: 8px 12px;
  border: none;
  background-color: white;
  color: black;
  border-radius: 4px 0 0 4px;
  cursor: pointer;

  &:hover {
    background-color: lightgray;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

function SearchBar({ setResults }) {
  const [query, setQuery] = useState("");
  const [, setSelectedGenre] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const API_KEY = '22a1b5a6a4a47ee5d44b9905a6d233c0';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const searchURL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&include_adult=false&language=en-US&page=1`;

  const handleSearch = () => {
    if (query.trim() === "") return;
    fetch(searchURL)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err));
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.id);
    setDropdownVisible(false);
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genre.id}`)
      .then(res => res.json())
      .then(json => setResults(json.results || []))
      .catch(err => console.error(err));
  }

  return (
    <div>
      <SearchContainer>
        <SearchButton onClick={handleSearch}>
          <img src={searchicon} alt="Search Icon" />
        </SearchButton>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <FilterButton onClick={() => setDropdownVisible(!isDropdownVisible)}>Filter</FilterButton>
        <DropdownMenu isVisible={isDropdownVisible}>
          {genres.map((genre) => (
            <DropdownItem key={genre.id} onClick={() => handleGenreSelect(genre)}>
              {genre.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </SearchContainer>
    </div>
  );
}

export default SearchBar;

