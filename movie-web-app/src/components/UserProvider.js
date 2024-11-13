// src/components/UserProvider.js
import { useState } from "react";
import { UserContext } from "/UserContext"; // Ensure this path is correct
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export function UserProvider({ children }) {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : { email: '', token: '' });

    // Sign Up
    const signUp = async (email, password) => {
        const json = JSON.stringify({ email, password });
        const headers = { headers: { 'Content-Type': 'application/json' } };
        try {
            await axios.post(`${url}/auth/register`, json, headers);
            setUser({ email: '', password: '' });
        } catch (error) {
            throw error;
        }
    };

    // Sign In
    const signIn = async (email, password) => {
        const json = JSON.stringify({ email, password });
        const headers = { headers: { 'Content-Type': 'application/json' } };
        try {
            const response = await axios.post(`${url}/auth/login`, json, headers);
            const token = response.data.token;
            const userData = { email, token };
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            setUser({ email: '', token: '' });
            throw error;
        }
    };

    // Logout
    const logout = () => {
        setUser({ email: '', token: '' });
        sessionStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, signUp, signIn, logout }}>
            {children}
        </UserContext.Provider>
    );
}
