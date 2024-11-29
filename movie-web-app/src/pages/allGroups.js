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
            <div className="groups-page">
                <h2 className="section-title">My Groups (Owner)</h2>
                {ownedGroups.length > 0 ? (
                    <div className="group-list">
                        {ownedGroups.map((group) => (
                            <div className="group-card" key={group.group_id}>
                                <h3 className="group-name">{group.name}</h3>
                                <p className="group-description">{group.description}</p>
                            </div>

                        ))}
                    </div>
                ) : (
                    <p className="no-groups-message">You are not the owner of any groups.</p>
                )}

                <h2 className="section-title">Groups I'm a Member Of</h2>
                {memberGroups.length > 0 ? (
                    <div className="group-list">
                        {memberGroups.map((group) => (
                            <div className="group-card" key={group.group_id}>
                                <h3 className="group-name">{group.name}</h3>
                                <p className="group-description">{group.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-groups-message">You are not a member of any groups.</p>
                )}

                <h2 className="section-title">All Groups</h2>
                {groups.length > 0 ? (
                    <div className="group-list">
                        {groups.map((group) => (
                            <div className="group-card" key={group.group_id}>
                                <h3 className="group-name">{group.name}</h3>
                                <p className="group-description">{group.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-groups-message">No groups available.</p>
                )}
            </div>
        </>
    );
}