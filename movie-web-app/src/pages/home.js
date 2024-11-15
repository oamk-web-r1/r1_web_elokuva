import React from 'react';
import Header from '../components/header';
import { useState } from 'react';
import Movie from '../components/movie';

export function Home() {
    const [results, setResults] = useState([])

    return (
        <>
            <Header setResults={setResults} />
            <Movie movies={results} />
            <div class="wrapper">
              <button class="button">Show more</button>
            </div>
    </>
    )
}