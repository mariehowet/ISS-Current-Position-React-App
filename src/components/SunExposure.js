import React, { useState, useEffect } from 'react';
import baseURL from "../constants/BaseURL";
const SunExposure = () => {
    const [illuminationWindows, setIlluminationWindows] = useState([]);

    useEffect(() => {
        const fetchIssData = async () => {
            try {
                const response = await fetch(`${baseURL}/iss/illumination`); //  We used async-await as this an external API call and needs to be loaded asynchronously.
                const data = await response.json();
                setIlluminationWindows(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIssData();
        const intervalId = setInterval(fetchIssData, 2000);
        return () => clearInterval(intervalId);
    }, []);


    return (
        <div>
            <h1 className="p-4 mt-4 bg-gray-200 rounded-lg text-2l font-bold mb-4">ISS Illumination Time Windows</h1>
            <div className="p-4 mt-4 bg-gray-200 rounded-lg max-h-screen overflow-y-auto">
                <ul className="menu rounded-box">
                    {illuminationWindows.map((window, index) => (
                        <li className="bg-indigo-200 w-56 p-2 m-2 rounded-box">
                            <p><strong>Date:</strong> { new Date(window.start_time).toLocaleDateString()}</p>
                            <p><strong>Start:</strong> {new Date(window.start_time).toLocaleTimeString()}</p>
                            <p><strong>End:</strong> {(window.end_time ? new Date(window.end_time).toLocaleTimeString() : "still in the daylight")}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );

}

export default SunExposure;