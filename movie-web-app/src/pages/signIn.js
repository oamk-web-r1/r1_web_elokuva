import { useUser } from "../context/useUser";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignIn() {
    const { user, setUser, signIn } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn();
            navigate('/');
        } catch (error) {
            const message = error.response && error.response.data ? error.response.data.error : error;
            alert(message);
        }
    };

    return (
        <div>
            <h3 class="default-big-title-pink">Sign In</h3>
            <div class="gray-box">
            <form onSubmit={handleSubmit}>
                <div>
                <label class="default-text">Email</label>
                <input
                        type="email"
                        value={user.email}
                        onChange={e=> setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div>
                    <label class="default-text">Password</label>
                    <input
                        type="password"
                        value={user.password}
                        onChange={e=> setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <button class="wide-button" type="submit">Sign In</button>   
            </form></div>                
            <div class="register-link">
                <Link class="link" to="/signup">Don't have an account?</Link>
            </div>
        </div>
    );
}
