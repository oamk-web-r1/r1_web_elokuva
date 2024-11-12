const API_URL = 'https://www.finnkino.fi/xml/Schedule/';

export const fetchShowtimes = async () => {
  try {
    const response = await fetch(API_URL);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const showtimes = Array.from(xml.getElementsByTagName('Show'));

    return showtimes.map((show) => ({
      id: show.getElementsByTagName('ID')[0].textContent,
      title: show.getElementsByTagName('Title')[0].textContent, 
      time: show.getElementsByTagName('dttmShowStart')[0].textContent,
      theatre: show.getElementsByTagName('Theatre')[0].textContent,
    }));
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return [];
  }
};
