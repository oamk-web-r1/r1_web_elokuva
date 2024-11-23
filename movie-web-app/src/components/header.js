import React from 'react';
import '../stylesheet.css'
import logo from '../assets/testlogo.png';
import SearchBar from './search';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser';
import accounticon from '../assets/accounticon.png';
import { useState } from 'react';
import DeleteAccount from './deleteAccount';

const Header = ({ setResults }) => {
  const { user, signOut } = useUser()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
}
  console.log("Current user:", user)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState)
  }

  return (
    <div class="header-container">
      <div class="header-content">
      <Link class="logo" to="/">
          <img src={logo} alt="Logo" /></Link>

        <SearchBar setResults={setResults} />

        <div class="header-button-container">
          {user && user.token && (
            <Link class="header-links" to="/allgroups">GROUPS</Link>
          )}
          <Link class="header-links" to="/showtimes">SHOWTIMES</Link>

          {user && user.token ? (
            <>
              <div class="account-menu-container" onClick={toggleDropdown}>
                <div class="account-icon-container">
                  <img src={accounticon} alt="Account Icon" class="account-icon" />
                </div>
                {dropdownOpen && (
                  <div class="account-dropdown-menu">
                    <Link class="account-dropdown-item" to="/profile">My Profile</Link>
                    <button class="account-dropdown-item" onClick={handleSignOut}>Sign Out</button>
                    <DeleteAccount />
                  </div>)}
              </div>
            </>
          ) : (
            <Link class="header-links" to="/signin">SIGN IN</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header