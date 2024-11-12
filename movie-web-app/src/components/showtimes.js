import React, { useEffect, useState } from 'react';
import ShowtimeCard from './ShowtimeCard';
import { fetchShowtimes } from '../utils/api';

function Showtimes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowtimes().then((showtimes) => {
      setData(showtimes);
      setLoading(false);
    });
  }, []);

  return (
    <div className="showtimes">
      {data.map((showtime) => (
        <ShowtimeCard key={showtime.id} showtime={showtime} />
      ))}
    </div>
  );
}

export default Showtimes;
