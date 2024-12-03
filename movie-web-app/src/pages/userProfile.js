import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { useUser} from '../context/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'; 

const url = 'http://localhost:3001'
const MyKey = process.env.REACT_APP_API_KEY

export default function MyProfile() {
    const [email, setEmail] = useState(null);
    const { user } = useUser()
    const [favorites, setFavorites] = useState([])
    const [shareUrl, setShareUrl] = useState('')


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
                .then((data) => {
                    setEmail(data.email)
                setShareUrl(`${window.location.origin}/favorites/${data.email}`);
                })
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
    });
};

    
    return (
        <>
            <Header />
            <h1 className='default-form-group'>My Profile</h1>
            <div className='default-align'>            
            <h2>My Information</h2>
            <p className='default-add-space'>{email || 'Fetching email...'}</p>
            
            <h2>My Favorites</h2>
            <div class="movie-container">
                {favorites.length > 0 ? (
                    favorites.map((movie) => (
                        <div class="movie-card" key={movie.id}>
                            <img class="poster-image"
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <p class="movie-title  default-add-space">{movie.title}</p>
                        </div>
                    ))
            ) : (
                <p>No favorites? Tough audience.</p>
                )}
            </div>

            <div className="share-icon-container default-form-group " onClick={copyToClipboard} title="Copy to Clipboard">
                    <FontAwesomeIcon
                        icon={faArrowUpFromBracket}
                        size="2x"
                        style={{ cursor: 'pointer', color: '#ffffff' }}
                    />
                </div>
            </div>
        </>
    );
}
