import React from 'react';
import { useUser } from '../context/useUser';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const { user, setUser, signUp } = useUser()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signUp()
            navigate('/signin')
        } catch (error) {
            const message = error.response && error.response.data ? error.response.data.error : error
            alert(message)
        }
    };

    return (
        <div>
            <h3 class="big-title">Sign up</h3>
            <div class="container">
            <form onSubmit={handleSubmit}>
                <div>
                    <div><label>Email</label></div>
                    <div><input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} /></div>
                </div>
                <div>
                    <div><label>Password</label></div>
                    <div><input type="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} /></div>
                </div>
                <div class="button-container">
                    <button class="button" type="submit">Register</button>
                </div>
            </form>
            </div>
        </div>
    );
}
