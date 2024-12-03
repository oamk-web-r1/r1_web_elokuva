import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { useUser} from '../context/useUser';

const url = 'http://localhost:3001'
const MyKey = process.env.REACT_APP_API_KEY

export default function MyProfile() {
    const [email, setEmail] = useState(null);
    const { user } = useUser()
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        console.log("User token:", user.token); // Check the token in the console
        if (user.token) {
            fetch(url + '/user/email', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('failed to fetch email');
                    }
                    return response.json();
                })
                .then((data) => setEmail(data.email))
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Fetch user's favorites
    useEffect(() => {
        if (user.token) {
            fetch(`${url}/favorites`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${user.token}` },
            })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites')
            }
            return response.json()
        })
        .then((data) => {
            const favoriteMovieIds = data.favorites
            const moviePromises = favoriteMovieIds.map((id) =>
                fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${MyKey}&language=en-US`)
                .then((res) => res.json())
          )
          Promise.all(moviePromises).then(setFavorites)
        })
        .catch((err) => console.error('Error fetching favorites:', err))
    }
  }, [user.token])
    
    return (
        <>
            <Header />
            <h1>My Profile</h1>
            <p>Email: {email || 'Fetching email...'}</p>

            <h2>My Favorites</h2>
            <div class="movie-container">
                {favorites.length > 0 ? (
                    favorites.map((movie) => (
                        <div class="movie-card" key={movie.id}>
                            <img class="poster-image"
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <p class="movie-title">{movie.title}</p>
                        </div>
                    ))
            ) : (
                <p>No favorites? Tough audience.</p>
                )}
            </div>
        </>
    );
}
