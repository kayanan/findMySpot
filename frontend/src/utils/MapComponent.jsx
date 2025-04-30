// MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom features
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for map styles

const MapComponent = ({ setPosition, position,zoom=15,width="100%",height="500px" }) => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });
    // const [position, setPosition] = useState(null); // Store selected position (lat, lng)

    // Custom hook to handle map events
    function MapEvents() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng); // Set position when the map is clicked
            }
        });
        return null;
    }
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude, error: null });
                    setPosition({ lat: latitude, lng: longitude });
                },
                (error) => {
                    setLocation({ ...location, error: error.message });
                }
            );
        } else {
            setLocation({ ...location, error: 'Geolocation is not supported by this browser.' });
        }
    };
    console.log(location);
    // Fetch location on component mount
    useEffect(() => {
        getLocation();
    }, []);

    return (
        location.latitude && location.longitude && (
            <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select the Parking Spot Location on the map</label>
        <div style={{ height: height, width: width }}>
           
            <MapContainer center={[location.latitude, location.longitude ]} zoom={zoom} style={{ width: '100%', height: '100%' }}>
                {/* TileLayer for OpenStreetMap */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Add custom event handler */}
                <MapEvents />

                {/* If a position is selected, show a marker on the map */}
                {position && (
                    <Marker position={position}>
                        <Popup>
                            Latitude: {position.lat} <br /> Longitude: {position.lng}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

         
        </div>
        </>
        )
    );
};

export default MapComponent;
