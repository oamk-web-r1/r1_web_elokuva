import React from 'react';

function ShowtimeCard({ showtime }) {
  return (
    <div className="showtime-card">
      <h3>{showtime.title}</h3>
      <p>Time: {showtime.time}</p>
      <p>Theatre: {showtime.theatre}</p>
    </div>
  );
}

export default ShowtimeCard;
