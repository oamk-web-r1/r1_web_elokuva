import React from 'react';
import Header from '../components/header';
import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';

const url = 'http://localhost:3001/groups'

export function AllGroups() {
    const [groups, setGroups] = useState([]);
    const [ownedGroups, setOwnedGroups] = useState([]);
    const [memberGroups, setMemberGroups] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((groupsData) => {  
                setGroups(groupsData);

                // Filter owned groups
                const myOwnedGroups = groupsData.filter(group => group.owner_id === user.user_id);
                setOwnedGroups(myOwnedGroups);

                // Fetch group members with user_id
                fetch(`http://localhost:3001/groupMembers/user/${user.user_id}`)
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

    return (
        <>
            <Header />
            <h2>My Groups (Owner)</h2>
            {ownedGroups.length > 0 ? (
                <ul>
                    {ownedGroups.map((group) => (
                        <li key={group.group_id}>
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You are not the owner of any groups.</p>
            )}

            <h2>Groups I'm a Member Of</h2>
            {memberGroups.length > 0 ? (
                <ul>
                    {memberGroups.map((group) => (
                        <li key={group.group_id}>
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You are not a member of any groups.</p>
            )}

            <h2>All Groups</h2>
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li key={group.group_id}>
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No groups available.</p>
            )}
        </>
    );
}