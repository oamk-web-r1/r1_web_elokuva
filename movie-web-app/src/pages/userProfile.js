import React, { useEffect, useState } from 'react';
import Header from '../components/header';

const url = 'http://localhost:3001/user/email'

export default function MyProfile() {
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await fetch(url , {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmail(data.email); // Assuming the response contains an 'email' field
                } else {
                    setEmail('Unable to fetch email'); // Fallback message for a failed request
                }
            } catch (error) {
                setEmail('Error fetching email'); // Fallback message for errors
            }
        };

        fetchEmail();
    }, []);

    return (
        <>
            <Header />
            <h1>My Profile</h1>
            <p>Email: {email || 'Fetching email...'}</p>
        </>
    );
}
