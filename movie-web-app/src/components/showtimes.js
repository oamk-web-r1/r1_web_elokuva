import { useEffect, useState } from "react";

function Showtimes() {

    const[times, setTimes] = useState([])
    const getFinnkinoShowtimes = (xml) =>{
    const parser = DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'application/xml')
    const root = xmlDoc.children
    const showtimes = root[0].children
    const tempTimes = []
    for( let i=0; i<showtimes.length; i++){
        //console.log(showtimes[i].children[0].innerHTML)
        //console.log(showtimes[i].children[1].innerHTML)
        tempTimes.push(
            {
                "id": showtimes[i].children[0].innerHTML,
                "start": showtimes[i].children[1].innerHTML
            }
        )
    }
    setTimes(tempTimes)
}

useEffect(() => {
    fetch ('https://www.finnkino.fi/xml/Schedule/')
    .then(response => response.text())
    .then(xml => {
        //console.log(xml)
        getFinnkinoShowtimes(xml)
    })
    .catch(error => {
        console.log(error)
    })
}, [])

return (
    <div>
        <select>
            {
                times.map( times => (
                    <option>{times.start}</option>
                ))
            }
        </select>
    </div>
)
}

export default Showtimes