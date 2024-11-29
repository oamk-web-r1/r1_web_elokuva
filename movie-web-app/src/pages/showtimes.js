import React, { useEffect, useState } from 'react';
import Header from '../components/header';

export default function Showtimes() {
    const [schedules, setSchedules] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState(''); 
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredSchedules, setFilteredSchedules] = useState([]);


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

return (
    <>
        <Header />
        <div class="showtime-container">
            <h1 class="default-big-title-white">Showtimes</h1>

            <div class="filter-container">
                <div>
                    <label htmlFor="theatre-select"></label>
                    <select
                        id="theatre-select"
                        value={selectedTheatre}
                        onChange={(e) => setSelectedTheatre(e.target.value)}
                        class="dropdown">
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
                        class="dropdown">
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
                <p class="placeholder">Please select a theatre to view showtimes.</p>
            ) : filteredSchedules.length > 0 ? (
                <ul class="results-container">
                    {filteredSchedules.map((schedule, index) => (
                        <div key={index} class="result-card">
                            <strong>{schedule.title}</strong> <br />
                            Theatre: {schedule.theatre} <br />
                            Start Time: {schedule.startTime}
                        </div>
                    ))}
                </ul>
            ) : (
                <p class="placeholder">No showtimes available for the selected theatre and date.</p>
            )}
        </div>
    </>
);
}

