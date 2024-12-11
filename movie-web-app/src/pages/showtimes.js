import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { useUser } from '../context/useUser';
import { useNavigate } from 'react-router-dom';

const url = process.env.REACT_APP_BACKEND_CONNECTION

export default function Showtimes() {
    const [schedules, setSchedules] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState(''); 
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [groups, setGroups] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);
    const [userGroups, setUserGroups] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [groupId, setSelectedGroupId] = useState(null);
    const [showtime, setShowtime] = useState(null);

    const getFinnkinoSchedules = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const shows = xmlDoc.getElementsByTagName('Show');
        const tempSchedules = [];

        for (let i = 0; i < shows.length; i++) {
            const show = shows[i];
            const title = show.getElementsByTagName('Title')[0]?.textContent || "Unknown Title";
            const theatre = show.getElementsByTagName('Theatre')[0]?.textContent || "Unknown Theatre";
            const startTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent || "Unknown Time";

            tempSchedules.push({
                title,
                theatre,
                startTime,
            });
        }

        setSchedules(tempSchedules);
    };

    useEffect(() => {
        fetch('https://www.finnkino.fi/xml/Schedule/')
            .then((response) => response.text())
            .then((xml) => {
                getFinnkinoSchedules(xml);
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
    }, []);

// Filter schedules when selectedTheatre or selectedDate changes
    useEffect(() => {
        if (!selectedTheatre) {
            setFilteredSchedules([]); // Clear if no theater is selected
            return;
        }

        let filtered = schedules.filter(
            (schedule) => schedule.theatre === selectedTheatre
        );


        if (selectedDate) {
            filtered = filtered.filter((schedule) =>
                schedule.startTime.startsWith(selectedDate)
            );
        }

    setFilteredSchedules(filtered);
}, [selectedTheatre, selectedDate, schedules]);

useEffect(() => {
    if (user.token) {
        // Fetch groups user is a member of
        const getMemberGroups = fetch(url + `/groupMembers/user/${user.user_id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Member groups:', data);
                return data;
            });
        
        // Fetch groups where user is owner
        const getOwnedGroups = fetch(url + `/groups`)
            .then(response => response.json())
            .then(data => {
                console.log('All groups:', data);
                // Filter groups where user is owner
                return data.filter(group => group.owner_id === user.user_id);
            });

        // Combine both results
        Promise.all([getMemberGroups, getOwnedGroups])
            .then(([memberGroups, ownedGroups]) => {
                console.log('Combined groups:', { memberGroups, ownedGroups });
                const allGroups = [...memberGroups, ...ownedGroups];
                // Remove duplicates based on group_id
                const uniqueGroups = [...new Map(allGroups.map(group => 
                    [group.group_id, group])).values()];
                setUserGroups(uniqueGroups);
            });
    }
}, [user]);

// theatres for dropdown
const theatres = [...new Set(schedules.map((schedule) => schedule.theatre))];

// Generate date options (today + next 6 days)
const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

const handleShareShowtime = async (schedule) => {
    console.log('User  token:', user.token);
    try {
        // Ensure groupId is set before making the request
        if (!groupId) {
            alert('Please select a group to share the showtime.');
            return;
        }

        const response = await fetch(`${url}/groups/addShowtime`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                groupId: groupId, // Ensure groupId is included
                title: schedule.title,
                theatre_name: schedule.theatre,
                startTime: schedule.startTime,
                additional_info: schedule.additional_info || null, // Include additional_info if available
                added_by: user.user_id // Assuming you want to track who added the showtime
            })
        });

        // Log the raw response text for debugging
        const textResponse = await response.text();
        console.log('Raw response:', textResponse); // Log the raw response

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${textResponse}`);
        }

        // Parse the JSON response
        const data = JSON.parse(textResponse);
        alert('Showtime shared successfully!');
        console.log('Shared showtime data:', data); // Log the response data for debugging

    } catch (error) {
        console.error('Error sharing showtime:', error);
        alert(`Failed to share showtime: ${error.message}`);
    }
};

  return (
    <>
        <Header />
        <div className="showtime-container">
            <h1 className="default-big-title-white">Showtimes</h1>
            <div className="filter-container">
                <div>
                    <label htmlFor="theatre-select"></label>
                    <select
                        id="theatre-select"
                        value={selectedTheatre}
                        onChange={(e) => setSelectedTheatre(e.target.value)}
                        className="dropdown"
                    >
                        <option value="">Select a Theatre</option>
                        {theatres.map((theatre, index) => (
                            <option key={index} value={theatre}>
                                {theatre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="date-select"></label>
                    <select
                        id="date-select"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        disabled={!selectedTheatre} // Disable if no theater is selected
                        className="dropdown"
                    >
                        <option value="">All Dates</option>
                        {generateDateOptions().map((date, index) => (
                            <option key={index} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedTheatre ? (
                <p className="placeholder">Please select a theatre to view showtimes.</p>
            ) : filteredSchedules.length > 0 ? (
                <div className="results-container">
                    {filteredSchedules.map((schedule, index) => (
                        <div key={index} className="result-card">
                            <strong>{schedule.title}</strong> <br />
                            Theatre: {schedule.theatre} <br />
                            Start Time: {schedule.startTime} <br />

                            <select
                value={groupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="dropdown"
            >
                <option value="">Select a group</option>
                {userGroups.map((group) => (
                    <option key={group.group_id} value={group.group_id}>{group.name}</option>
                ))}
            </select>
            <button className="default-button-pink" onClick={() => handleShareShowtime({ ...schedule, groupId })}>
    Share to Group
</button>

                        </div>
                    ))}
                </div>
            ) : (
                <p className="placeholder">No showtimes available for the selected theatre and date.</p>
            )}
        </div>
    </>
)}
