import { useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";

const url = 'http://localhost:3001'

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage): {email: '', password: ''})

    const signUp = async () => {
        const json = JSON.stringify(user)
        const headers = { headers: { 'Content-Type': 'application/json' } }
        try {
            await axios.post(url + '/user/register', json, headers)
            setUser({ email: '', password: '' })
        } catch (error) {
            throw error
        }
    }

    const signIn = async () => {
        const json = JSON.stringify(user)
        const headers = { headers: { 'Content-Type': 'application/json' } }
        try {
            await axios.post(url + '/user/login', json, headers)
            setUser({ email: '', password: '' })
        } catch (error) {
            throw error
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
            { children }
        </UserContext.Provider>
    )
}