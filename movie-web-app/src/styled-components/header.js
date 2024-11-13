import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/testlogo.png';
import SearchBar from '../components/search';

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

const Header = ({setResults}) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <img src={logo} alt="Logo" />
        </Logo>

        <SearchBar setResults={setResults} />

        <ButtonContainer>
          <HeaderLinks to={'/allgroups'}>GROUPS</HeaderLinks>
          <HeaderLinks to={'/signin'}>SIGN IN</HeaderLinks>
        </ButtonContainer>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header
