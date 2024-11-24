import React from 'react';
import Header from '../components/header';
import { useState, useEffect } from 'react';

const url = 'http://localhost:3001'

export function AllGroups() {
    const [groups, setGroups] = useState([])

    useEffect(() => {
        fetch(url + '/groups')
            .then((response) => response.json())
            .then((data) => setGroups(data))
            .catch((err) => console.error('Error fetching groups:', err))
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