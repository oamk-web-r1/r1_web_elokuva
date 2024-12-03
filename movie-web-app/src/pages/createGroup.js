import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/useUser'; 
import Header from '../components/header';

export function CreateGroup() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [groupData, setGroupData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    owner_id: user.user_id,
                    name: groupData.name,
                    description: groupData.description
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create group');
            }

            //Show success alert
            alert('Group created successfully! You can view your groups at Groups page.');

            // Redirect to groups page on success
            navigate('/addusers', { state: { groupId: data.group_id } });
        } catch (error) {
            setError(error.message);
        }
    };
    
    return (
    <>
        <Header />
        <div className="page-container">
        <div>
            <h3 className="default-big-title-pink default-form-group">Create a group</h3>
            <div className="gray-box">
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="centered-form">
                    <div className="defaul-form-group">
                        <label className="default-text">Group name</label>
                        <input
                        className="default-input"
                            type="text"
                            value={groupData.name}
                            onChange={e => setGroupData({ ...groupData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="default-text">Description</label>
                        <input
                            className="default-input"
                            type="text"
                            value={groupData.description}
                            onChange={e => setGroupData({ ...groupData, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="default-button-pink center-item" >Publish Group</button>
                </form>
            </div>
        </div>
        </div>
    </>
    );
}
