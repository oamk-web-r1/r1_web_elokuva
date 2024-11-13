import React from 'react';
import Header from '../styled-components/header';
import GlobalStyle from '../styled-components/globalStyle';
import Button from '../styled-components/button';
import Wrapper from '../styled-components/wrapper';
import { useState } from 'react';
import Movie from '../components/movie';

export function Home() {
    const [results, setResults] = useState([])

    return (
        <>
            <Header setResults={setResults} />
            <GlobalStyle />
            <Movie movies={results} />
            <Wrapper>
              <Button>Show more</Button>
            </Wrapper>
    </>
    )
}