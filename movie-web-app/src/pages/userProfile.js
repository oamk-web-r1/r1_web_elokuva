import React, { useEffect, useState } from 'react';
import Header from '../components/header';

const url = 'http://localhost:3001/user/email'

export default function MyProfile() {
    const [email, setEmail] = useState(null);

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
    
    return (
        <>
            <Header />
            <h1>My Profile</h1>
            <p>Email: {email || 'Fetching email...'}</p>
        </>
    );
}