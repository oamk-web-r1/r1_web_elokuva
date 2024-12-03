import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';
import Header from '../components/header';

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
    const [groupShowtimes, setGroupShowtimes] = useState([]);

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
            fetch(url + `/groupMembers/nonmembers/${groupId}`)
                .then(response => response.json())
                .then(data => setNonMembers(data))
                .catch(err => console.error(err))

            //fetch and display the shared showtimes for a group    
            fetch(url + `/groups/${groupId}/showtimes`)
                .then((res) => res.json())
                .then((data) => setGroupShowtimes(data))
                .catch((err) => console.error('Error fetching group showtimes:', err));
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
                alert('User rejected')
                setPendingRequests(prev => prev.filter(req => req.user_id !== user_id))
            })
            .catch(err => console.error(err))
    }

    const handleShowNonMembers = () => {
        fetch(url + `/groupMembers/nonmembers/${groupId}`)
            .then(response => response.json())
            .then(data => setNonMembers(data))
            .catch(err => console.error(err))
        setShowAddMembers(prevState => !prevState)
        setShowRemoveMembers(false)
    }
    
    const handleShowRemoveMembers = () => {
        fetch(url + `/groupMembers/members/${groupId}`)
            .then(response => response.json())
            .then(data => setMembers(data))
            .catch(err => console.error(err))
        setShowRemoveMembers(prevState => !prevState)
        setShowAddMembers(false)
    }

    const handleRemoveMember = (user_id) => {
        fetch(url + `/groupMembers/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            alert('User removed successfully!')
            setMembers(prev => prev.filter(member => member.user_id !== user_id))
        })
        .catch(err => {
            console.error('Failed to remove member:', err)
        })
    }

    const handleAddMember = (user_id) => {
        fetch(url + `/groupMembers/owner/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ user_id, group_id: groupId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            } else {
                alert('User added successfully!');
                setNonMembers(prev => prev.filter(user => user.user_id !== user_id))
            }
        })
        .catch(err => console.error(err))
    }
    
    if (!group) {
        return <p>Loading...</p>
    }

    return (
        <>
        <Header />
        
        <div className="center-item">
            <h2 className="default-big-title-white">{group.name}</h2>
            <p className="default-text">{group.description}</p>

            {user.user_id === group.owner_id && pendingRequests.length > 0 && (
                <>
                    <div>
                        {pendingRequests.map(request => (
                            <div key={request.user_id} className="join-request-box">
                                <p>{request.email} wants to join</p>
                                <div className="join-request-buttons">
                                <button className="accept-button" onClick={() => handleAcceptRequest(request.user_id)}>
                                    <i class="fa-solid fa-check"></i></button>
                                <button className="reject-button" onClick={() => handleRejectRequest(request.user_id)}>
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div></div>
                        ))}
                    </div>
                </>
            )}

            <h2>Favorites</h2>

            <h2>Showtimes</h2>

            {user.user_id === group.owner_id && (
                <>
                <div className="button-container">
                    <button className="gray-button" onClick={handleShowNonMembers}> Add Members</button>
                    <button className="gray-button" onClick={handleShowRemoveMembers}>Remove Members</button>
                </div>
        
            {showAddMembers && (
                <div className="user-list">
                    {nonMembers.map(user => (
                        <div key={user.user_id} className="user-list-item">
                            <p>{user.email}</p>
                            <button className="default-button-pink" onClick={() => handleAddMember(user.user_id)}>
                                <i class="fa-solid fa-user-plus"></i></button>
                        </div>
                    ))}
                </div>
            )}

            {showRemoveMembers && (
                <div className="user-list">
                    {members.map(member => (
                        <div key={member.user_id} className="user-list-item">
                            <p>{member.email}</p>
                            <button className="default-button-pink" onClick={() => handleRemoveMember(member.user_id)}>
                                <i class="fa-solid fa-user-minus"></i></button>
                        </div>
                    ))}
                </div>
            )}
                </>
            )}
        </div></>
    )
}