import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { useUser} from '../context/useUser';

const url = 'http://localhost:3001'

export default function MyProfile() {
    const [email, setEmail] = useState(null);
    const { user } = useUser()

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
            <h1 className='default-form-group'>My Profile</h1>
            <div className='default-align'>            
            <h2>My Information</h2>
            <p>{email || 'Fetching email...'}</p>
            </div>

        </>
    );
}
