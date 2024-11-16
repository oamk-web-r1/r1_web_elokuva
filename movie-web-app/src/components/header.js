import React from 'react';
import '../stylesheet.css'
import logo from '../assets/testlogo.png';
import SearchBar from './search';
import { Link } from 'react-router-dom';

const Header = ({setResults}) => {
  return (
    <div class="header-container">
      <div class="header-content">
      <Link className="logo" to="/">
          <img src={logo} alt="Logo" />
        </Link>

        <SearchBar setResults={setResults} />

        <div class="button-container">
        <Link className="header-links" to={'/allgroups'}>GROUPS</Link>
        <Link className="header-links" to={'/showtimes'}>SHOWTIMES</Link>
        <Link className="header-links" to={'/signin'}>SIGN IN</Link>
        </div>
      </div>
    </div>
  )
}

export default Header
