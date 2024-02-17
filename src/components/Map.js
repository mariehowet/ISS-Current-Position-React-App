import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import SunExposure from "./SunExposure";
import baseURL from "../constants/BaseURL";

const Map = () => {
    const [map, setMap] = useState(null);
    const [issPosition, setIssPosition] = useState(null); //TODO : faire sortir lonngitude et latitude
    const [issMarker, setIssMarker] = useState(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [issSunExposed, setIssSunExposed] = useState(false);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaG93IiwiYSI6ImNsc24wZGFlMDBoNWoyam9lZ2VmanNtMHIifQ.5APRNGiD_m2sVqx0AKkM_g';

        const initializeMap = () => {
            const mapInstance = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0], // TODO : centrer la map % au marqueur
                zoom: 1
            });

            mapInstance.addControl(new mapboxgl.NavigationControl());

            mapInstance.on('load', () => {
                setMap(mapInstance);
            });
        };

        initializeMap();
    }, []);

    useEffect(() => {
        const fetchIssData = async () => {
            try {
                const response = await fetch(`${baseURL}/iss/position`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ISS position');
                }
                const data = await response.json();
                setIssPosition([data['longitude'], data['latitude']]);
                setLng(data["longitude"])
                setLat(data["latitude"])
                setIssSunExposed(data["visibility"]);
            } catch (error) {
                console.error(error);
            }
        };

        const intervalId = setInterval(fetchIssData, 20000); // TODO: 1ere appel après 30 sec
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
                .setLngLat([lng, lat])
                .addTo(map);

            // Save the marker reference for future updates
            setIssMarker(marker);
            let sidebar = document.getElementById("sidebar");
            sidebar.style.background = issSunExposed ? 'tahiti' : 'black';
            sidebar.style.color = issSunExposed ? 'black' : 'white';
        }
    }, [map, issPosition, issSunExposed]);

    return (
        <div id="map"  className="flex-auto p-4 mt-4 ml-4 bg-gray-200 rounded-lg overflow-y-auto">
            <div id="sidebar" className="bg-blue-800 bg-opacity-90 text-white p-2 font-mono font-bold z-10 absolute top-0 left-0 m-3 rounded-md">
                Longitude: {lng} | Latitude: {lat} | Sun exposure: {issSunExposed? "Light": "Dark"}
            </div>
        </div>
    );
};

export default Map;
