import React, { useEffect, useState } from 'react';
import Header from '../components/header';

export default function Showtimes() {
    const [schedules, setSchedules] = useState([]);

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

    return (
        <>
            <Header />
            <div>
                <h1>Showtimes</h1>
                <ul>
                    {schedules.map((schedule, index) => (
                        <li key={index}>
                            <strong>{schedule.title}</strong> <br />
                            Theatre: {schedule.theatre} <br />
                            Start Time: {schedule.startTime}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
