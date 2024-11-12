import React from 'react';
import Header from '../styled-components/header';
import GlobalStyle from '../styled-components/globalStyle';
import Button from '../styled-components/button';
import Wrapper from '../styled-components/wrapper';

export function Home() {
    return (
        <>
            <Header />
            <GlobalStyle />
                <Wrapper><Button>Button</Button></Wrapper>
                <Wrapper><Button>Button</Button></Wrapper>
        </>
    )
}