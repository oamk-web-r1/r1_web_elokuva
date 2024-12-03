import React, { useState, useEffect } from "react";

export function AddUsers({ groupId }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
                setUsers(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3001/groups/${groupId}/add-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userIds: selectedUsers })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to add users to group');
            alert('Users added successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div>
            <h3>Select Users to Add to Group</h3>
            {error && <div className="error-message">{error}</div>}
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        <label>
                            <input
                                type="checkbox"
                                value={user.user_id}
                                onChange={() => toggleUserSelection(user.user_id)}
                            />
                            {user.email}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddUsers}>Add Selected Users</button>
        </div>
    );
}
