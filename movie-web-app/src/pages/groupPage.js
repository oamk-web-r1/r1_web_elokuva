import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';

const url = 'http://localhost:3001'

export function GroupPage() {
    const { user } = useUser()
    const { groupId } = useParams()
    const [group, setGroup] = useState(null)
    const [pendingRequests, setPendingRequests] = useState([])
    const [nonMembers, setNonMembers] = useState([])
    const [members, setMembers] = useState([])
    const [showAddMembers, setShowAddMembers] = useState(false)
    const [showRemoveMembers, setShowRemoveMembers] = useState(false)

    useEffect(() => {
        // Fetch group info by group id
        fetch(url + `/groups/${groupId}`)
            .then(response => response.json())
            .then(json => {
                setGroup(json[0])
            })
            .catch(err => console.error(err))
            
            // Fetch pending join requests
            if (user.user_id) {
                fetch(url + `/groupMembers/requests/${groupId}`)
                .then(response => response.json())
                .then(data => setPendingRequests(data))
                .catch(err => console.error(err))

            // Fetch users who are not members and not the owner
            fetch(url + `/groupMembers/non-members/${groupId}`)
                .then(response => response.json())
                .then(data => setNonMembers(data))
                .catch(err => console.error(err))
            }
    }, [groupId, user.user_id])

    const handleAcceptRequest = (user_id) => {
        fetch(url + `/groupMembers/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
            .then(response => response.json())
            .then(data => {
                alert('User accepted')
                setPendingRequests(prev => prev.filter(req => req.user_id !== user_id))
            })
            .catch(err => console.error(err))
    }

    const handleRejectRequest = (user_id) => {
        fetch(url + `/groupMembers/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
            .then(response => response.json())
            .then(data => {
                alert('User rejected');
                setPendingRequests(prev => prev.filter(req => req.user_id !== user_id))
            })
            .catch(err => console.error(err))
    }

    const handleShowNonMembers = () => {
        fetch(url + `/groupMembers/nonmembers/${groupId}`)
            .then(response => response.json())
            .then(data => setNonMembers(data))
            .catch(err => console.error(err))
        setShowAddMembers(true)
    }

    const handleAddMember = (user_id) => {
        fetch(url + `/groupMembers/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
            .then(response => response.json())
            .then(data => {
                alert('User added successfully!')
                setNonMembers(prev => prev.filter(user => user.user_id !== user_id))
            })
            .catch(err => console.error(err))
    }

    const handleShowRemoveMembers = () => {
        fetch(url + `/groupMembers/members/${groupId}`)
            .then(response => response.json())
            .then(data => setMembers(data))
            .catch(err => console.error(err))
        setShowRemoveMembers(true)
    }

    const handleRemoveMember = (user_id) => {
        fetch(url + `/groupMembers/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
            .then(response => response.json())
            .then(data => {
                alert('User removed successfully!')
                setMembers(prev => prev.filter(member => member.user_id !== user_id))
            })
            .catch(err => console.error(err))
    }

    if (!group) {
        return <p>Loading...</p>
    }

    return (
        <>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <p>Owner ID: {group.owner_id}</p>

            {user.user_id === group.owner_id && pendingRequests.length > 0 && (
                <>
                    <h3>Pending Join Requests:</h3>
                    <div>
                        {pendingRequests.map(request => (
                            <div key={request.user_id}>
                                <p>User: {request.user_id}</p>
                                <button onClick={() => handleAcceptRequest(request.user_id)}>Accept</button>
                                <button onClick={() => handleRejectRequest(request.user_id)}>Reject</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {user.user_id === group.owner_id && (
                <>
                    <button onClick={handleShowNonMembers}>Add Members</button>
                    {showAddMembers && (
                        <div>
                            <h3>Available Users:</h3>
                            {nonMembers.map(user => (
                                <div key={user.user_id}>
                                    <p>{user.email}</p>
                                    <button onClick={() => handleAddMember(user.user_id)}>Add</button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {user.user_id === group.owner_id && (
                <>
                    <button onClick={handleShowRemoveMembers}>Remove Members</button>
                    {showRemoveMembers && (
                        <div>
                            <h3>Group Members (Except Owner):</h3>
                            {members.map(member => (
                                <div key={member.user_id}>
                                    <p>{member.email}</p>
                                    <button onClick={() => handleRemoveMember(member.user_id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    )
}