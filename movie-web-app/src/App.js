import './App.css';
import React from 'react';
import { Home } from './pages/home';
import Showtimes from './components/showtimes';

function App() {
  return(
  <div className="App">
  <h1>Theatre Showtime Search</h1>
  <Showtimes />
</div>
);
}

export default App
