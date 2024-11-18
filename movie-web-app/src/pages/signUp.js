import React from 'react';
import { useUser } from '../context/useUser';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
            <h3 class="default-big-title-pink">Sign up</h3>
            <div class="gray-box">
            <form onSubmit={handleSubmit}>
                <div>
                    <label class="default-text-left">Email</label>
                    <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
                </div>
                <div>
                    <label class="default-text-left">Password</label>
                    <input type="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
                </div>
                <div>
                    <button class="wide-button" type="submit">Register</button>
                </div>
            </form>
            
            </div>
            <div>
                <Link class="link" to="/signin">Already have an account?</Link>
            </div>
        </div>
    );
}
