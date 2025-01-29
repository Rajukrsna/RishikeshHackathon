import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine"; // For route display
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./Map.css"; // Add styles if needed

const Map = ({ selectedDestination }) => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map
        const newMap = L.map(mapContainerRef.current).setView([30.1034, 78.2676], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(newMap);

        setMap(newMap);

        return () => newMap.remove();
    }, []);

    useEffect(() => {
        if (!map || !selectedDestination) return;

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                const destinationLocation = [selectedDestination.latitude, selectedDestination.longitude];

                // Add markers for user and destination
                const userMarker = L.marker(userLocation, {
                    icon: L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/4128/4128176.png", // Person icon
                        iconSize: [30, 30]
                    })
                }).addTo(map).bindPopup("Your Location").openPopup();

                const destMarker = L.marker(destinationLocation, {
                    icon: L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Destination icon
                        iconSize: [35, 35]
                    })
                }).addTo(map).bindPopup(`<b>${selectedDestination.name}</b>`).openPopup();

                // Add route using Leaflet Routing Machine
                L.Routing.control({
                    waypoints: [L.latLng(...userLocation), L.latLng(...destinationLocation)],
                    routeWhileDragging: true,
                    createMarker: () => null, // Hide default markers
                    lineOptions: {
                        styles: [{ color: "green", weight: 6 }] // Sustainable route in green
                    }
                }).addTo(map);

                // Animate person moving along the route
                animatePerson(userLocation, destinationLocation, map, userMarker, destMarker);

            }, (error) => console.error("Geolocation Error:", error));
        }
    }, [map, selectedDestination]);

    // Function to animate marker
    function animatePerson(start, end, map, marker) {
        const steps = 100; // Number of animation steps
        let i = 0;

        const latStep = (end[0] - start[0]) / steps;
        const lngStep = (end[1] - start[1]) / steps;

        const interval = setInterval(() => {
            if (i >= steps) {
                clearInterval(interval);
                return;
            }
            const newLat = start[0] + latStep * i;
            const newLng = start[1] + lngStep * i;
            marker.setLatLng([newLat, newLng]);
            map.panTo([newLat, newLng]);
            i++;
        }, 100); // Adjust speed
    }

    return <div ref={mapContainerRef} className="map-container" style={{ height: "100vh" }}></div>;
};

export default Map;
