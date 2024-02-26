import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import SunExposure from "./SunExposure";
import baseURL from "../constants/BaseURL";

const Map = () => {
    const [map, setMap] = useState(null);
    const [issPosition, setIssPosition] = useState(["",""]);
    const [issMarker, setIssMarker] = useState(null);
    const [issSunExposed, setIssSunExposed] = useState(false);

    useEffect(() => {
        mapboxgl.accessToken = VITE_API_KEY;

        const initializeMap = () => {
            const mapInstance = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0],
                zoom: 1
            });

            mapInstance.addControl(new mapboxgl.NavigationControl());

            mapInstance.on('load', () => { // When the map have finished to be loaded, I store it in map to get access to hit later
                setMap(mapInstance);
            });
        };

        initializeMap();
    }, []);

    useEffect(() => {
        const fetchIssData = async () => {
            try {
                const response = await fetch(`${baseURL}/iss/position`);
                const data = await response.json();
                setIssPosition([data['longitude'], data['latitude']]);
                setIssSunExposed(data["is_sun_exposed"]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchIssData();
        const intervalId = setInterval(fetchIssData, 2000);
        return () => clearInterval(intervalId);
    }, []);



    useEffect(() => {
        if(map && issPosition) {
            // Remove existing marker if it exists
            if (issMarker) {
                issMarker.remove();
            }

            // Create new marker at the updated position
            const marker = new mapboxgl.Marker({
                color: issSunExposed ? 'yellow' : 'black'
            })
                .setLngLat(issPosition)
                .addTo(map);

            // Save the marker reference for future updates
            setIssMarker(marker);
            map.setCenter(issPosition)
            let sidebar = document.getElementById("sidebar");
            sidebar.style.background = issSunExposed ? 'yellow' : 'black';
            sidebar.style.color = issSunExposed ? 'black' : 'yellow';
        }
    }, [map, issPosition, issSunExposed]);

    return (
        <div id="map" className="flex-auto min-h-96 p-4 mt-4 ml-4 bg-gray-200 rounded-lg overflow-y-auto">
            <div id="sidebar" className="bg-blue-800 bg-opacity-90 text-white p-2 font-mono font-bold z-10 absolute top-0 left-0 m-3 rounded-md">
                Longitude: {issPosition[0]} | Latitude: {issPosition[1]} | Sun exposure: {issSunExposed? "Daylight": "Eclipsed"}
            </div>
        </div>
    );
};

export default Map;
