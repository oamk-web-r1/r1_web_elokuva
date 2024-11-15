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
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={e=> setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={user.password}
                        onChange={e=> setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <button class="button" type="submit">Sign In</button>   
            </form>                
            <div className="register-link">
                <Link to="/signup">Don't have an account?</Link>
            </div>
        </div>
    );
}
