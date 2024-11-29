import React from 'react';
import Header from '../components/header';
import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';
import { Link } from 'react-router-dom'

const url = 'http://localhost:3001'

export function AllGroups() {
    const [groups, setGroups] = useState([]);
    const [ownedGroups, setOwnedGroups] = useState([]);
    const [memberGroups, setMemberGroups] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({})
    const { user } = useUser();

    useEffect(() => {
        fetch(url + `/groups`)
            .then((response) => response.json())
            .then((groupsData) => {
                setGroups(groupsData);

                // Filter owned groups
                const myOwnedGroups = groupsData.filter(group => group.owner_id === user.user_id);
                setOwnedGroups(myOwnedGroups);

                // Fetch group members with user_id
                fetch(url + `/groupMembers/user/${user.user_id}`)
                    .then((response) => response.json())
                    .then((memberships) => {
                        console.log('Memberships:', memberships);
                        const acceptedGroupIds = memberships.map(member => member.group_id);
                        console.log('Accepted Group IDs:', acceptedGroupIds);

                        // Filter member groups using groupsData from outer scope
                        const myMemberGroups = groupsData.filter(group => 
                            acceptedGroupIds.includes(group.group_id)
                        );

                        console.log('My Member Groups:', myMemberGroups);
                        setMemberGroups(myMemberGroups);
                    })
                    .catch((err) => console.error('Error fetching group members:', err));
            })
            .catch((err) => console.error(err));
    }, [user.user_id]);
    
    const handleJoinRequest = (group_id) => {
        fetch(url + `/groupMembers/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id, group_id })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Join request sent:', data)
            alert('Join request sent')
          })
          .catch(err => console.error(err))
      }

      useEffect(() => {
        // Fetch pending join requests for groups the user owns
        if (ownedGroups.length > 0) {
            ownedGroups.forEach(group => {
                fetch(url + `/groupMembers/requests/${group.group_id}`)
                    .then(response => response.json())
                    .then(data => {
                        // Store pending requests, grouped by group_id
                        setPendingRequests(prev => ({ ...prev, [group.group_id]: data }))
                    })
                    .catch(err => console.error(err))
            })
        }
    }, [ownedGroups])

    const handleAcceptRequest = (user_id, group_id) => {
        fetch(url + `/groupMembers/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, group_id })
        })
        .then(response => response.json())
        .then(data => {
            alert('User accepted')
            setPendingRequests(prev => ({
                ...prev,
                [group_id]: prev[group_id].filter(req => req.user_id !== user_id)
            }))
        })
        .catch(err => console.error(err))
    }

    return (
        <>
            <Header />
            <div className="groups-page">
            <h2 className="section-title">My Groups (Owner)</h2>
            {ownedGroups.length > 0 ? (
                <div className="group-list">
                    {ownedGroups.map((group) => (
                        <div className="group-card" key={group.group_id}>
                            <h3 className="group-name">
                                <Link to={`/grouppage/${group.group_id}`}>{group.name}</Link></h3>
                            <p className="group-description">{group.description}</p>

                            {pendingRequests[group.group_id] &&
                            pendingRequests[group.group_id].length > 0 && (
                                <>
                                <h3>Pending Requests:</h3>
                                <div>
                                    {pendingRequests[group.group_id].map(request => (
                                        <div key={request.user_id}>
                                            User: {request.user_id}
                                            <button onClick={() => handleAcceptRequest(request.user_id, group.group_id)}>Accept</button>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-groups-message">You are not the owner of any groups.</p>
            )}

            <h2 className="section-title">All Groups</h2>
            {groups.length > 0 ? (
                <div className="group-list">
                    {groups.map((group) => {
                        const isMemberOrOwner = memberGroups.some(g => g.group_id === group.group_id) || ownedGroups.some(g => g.group_id === group.group_id)
                        
                        return (
                            <div className="group-card" key={group.group_id}>
                            <h3 className="group-name">
                            <Link to={`/grouppage/${group.group_id}`}>{group.name}</Link>
                            </h3>
                            <p className="group-description">{group.description}</p>
    
                            {!isMemberOrOwner && (
                                <button onClick={() => handleJoinRequest(group.group_id)}>JOIN</button>
                                )}
                            </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="no-groups-message">You are not the owner of any groups.</p>
                )}
    <div className='center-item'>
            <button className="default-button-pink"><Link className="default-link-text" to="/creategroup"> Create New Group </Link> </button>
            </div>
            
                <h2 className="section-title">Groups I'm a Member Of</h2>
                {memberGroups.length > 0 ? (
                    <div className="group-list">
                        {memberGroups.map((group) => (
                            <div className="group-card" key={group.group_id}>
                                <h3 className="group-name">
                                <Link to={`/grouppage/${group.group_id}`}>{group.name}</Link>
                                </h3>
                                <p className="group-description">{group.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-groups-message">You are not a member of any groups.</p>
                )}
            </div>
        </>
    )
}
