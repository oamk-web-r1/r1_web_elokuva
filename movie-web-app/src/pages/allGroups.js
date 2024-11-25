import React from 'react';
import Header from '../components/header';
import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';

const url = 'http://localhost:3001/groups'

export function AllGroups() {
    const [groups, setGroups] = useState([])
    const [userGroups, setUserGroups] = useState([])
    const { user } = useUser()

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setGroups(data))
            .catch((err) => console.error(err))
    }, [])

    return (
        <>
            <Header />
            <h2>My Groups</h2>
            <h2>All Groups</h2>
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li key={group.group_id}>
                            <h2>{group.name}</h2>
                            <p>{group.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No groups available.</p>
            )}
        </>
    )
}