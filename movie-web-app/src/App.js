import './App.css';
import React from 'react';
import { Home } from './pages/home';
import Header from './styled-components/header';
import Movie from './components/movie';

function App() {
  /*const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };*/

  return (
    <div>
      <Home />
    </div>
  )
}

export default App
