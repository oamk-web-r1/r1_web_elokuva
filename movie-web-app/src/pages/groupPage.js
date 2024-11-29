import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const url = 'http://localhost:3001'

export function GroupPage() {
    const { groupId } = useParams()
    const [group, setGroup] = useState(null)

    useEffect(() => {
        fetch(url + `/groups/${groupId}`)
            .then(response => response.json())
            .then(json => {
                setGroup(json[0])
            })
            .catch(err => console.error(err))
    }, [groupId])

    if (!group) {
        return <p>Loading...</p>
    }

    return (
        <>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <p>Group ID: {group.group_id}</p>
            <p>Owner ID: {group.owner_id}</p>
        </>
    )
}