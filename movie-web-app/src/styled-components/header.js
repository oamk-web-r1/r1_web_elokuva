import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/testlogo.png';
import axios from 'axios';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  padding: 15px 20px;
  background-color: #242424;
  color: #fff;
  margin-bottom: 10px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  gap: 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  img {
    height: 40px;
    width: auto;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px 0 0 4px;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const HeaderLinks = styled(Link)`
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  background-color: #333;

  &:hover {
  background-color: #242424;
  color: #CA2145;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <img src={logo} alt="Logo" />
        </Logo>

        <SearchContainer>
          <SearchInput type="text" placeholder="Search..." />
          <FilterButton>Filter</FilterButton>
        </SearchContainer>

        <ButtonContainer>
          <HeaderLinks to={'/allgroups'}>GROUPS</HeaderLinks>
          <HeaderLinks to={'/allreviews'}>REVIEWS</HeaderLinks>
          <HeaderLinks to={'/signin'}>SIGN IN</HeaderLinks>
        </ButtonContainer>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header
