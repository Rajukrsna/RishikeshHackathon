import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Map from './components/Map';
import Activities from './components/Activities';
import Profile from './components/Profile';
import Modal from './components/Modal';
import DestinationModal from './components/DestinationModal';
import SuggestionCard from './components/SuggestionCard';
import WeatherCondition from './components/WeatherCondition';
import './App.css';
const App = () => {
    const [showJourneyModal, setShowJourneyModal] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [preferencesData, setPreferencesData] = useState(null); // Store data from Journey Modal
    const [showSuggestionCard, setShowSuggestionCard] = useState(false); // State to show the SuggestionCard


       // Function to close the suggestion card
       const handleCloseSuggestionCard = () => {
        setShowSuggestionCard(false);
    };
    useEffect(() => {
        console.log('Updated suggestions:', suggestions);
    }, [suggestions]);

    // Function to open the modal to start the journey
    const handleStartJourney = () => setShowJourneyModal(true);

    // Function to handle preference submission
    const handlePreferencesSubmit = async (data) => {
        setShowJourneyModal(false);
        setPreferencesData(data);
         // Store preferences data for later use
        console.log("Selected category:", data.type); // Log the selected category

        try {
            // Fetch destinations
            const destinationsResponse = await fetch(
                `http://localhost:5000/api/destinations?category=${data.type}`
            );
            const destinationsResult = await destinationsResponse.json();

            // Update state for destinations
            setDestinations(destinationsResult);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    // Function to select a destination, combine it with preferences data, and send it to the backend
    const handleDestinationSelect = async (destination) => {
        setSelectedDestination(destination);
        setDestinations([]); // Clear destinations after selection

        if (!preferencesData) {
            console.error('Preferences data is missing. Ensure preferences are submitted first.');
            return;
        }

        try {
            // Combine preferences data and destination, then send it to the backend
            const response = await fetch('http://localhost:5000/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...preferencesData, destination }),
            });

            const result = await response.json();
            setSuggestions(result.suggestions || []); // Update suggestions based on the backend response
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    // Handle button click to show the SuggestionCard
    const handleShowSuggestionCard = () => {
        setShowSuggestionCard(true);
    };

    return (
        <Router>
            <Navbar onStartJourney={handleStartJourney} />

            <Routes>
                <Route 
                    path="/" 
                    element={
                        <>
                            <Map selectedDestination={selectedDestination} />
                            <WeatherCondition />
                        </>
                    } 
                />
                <Route path="/activities" element={<Activities />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>

            {/* Journey modal for user preferences */}
            {showJourneyModal && <Modal onSubmit={handlePreferencesSubmit} />}

            {/* Destination modal to display the list of destinations */}
            {destinations.length > 0 && (
                <DestinationModal
                    destinations={destinations}
                    onSelect={handleDestinationSelect} // Send data when a destination is selected
                />
            )}

            {/* Button to display SuggestionCard (only after preferences are submitted and suggestions exist) */}
            {destinations && (
                <div className="suggestion-icon-container">
                    <div className="click-me-label">Click Me</div>
                    <div
                        className="suggestion-icon"
                        onClick={handleShowSuggestionCard}
                    >
                        {/* Use any cute icon or Font Awesome icon */}
                        <i className="fas fa-hand-point-up"></i>
                    </div>
                </div>
            )}

            {/* Conditionally render SuggestionCard */}
            {showSuggestionCard && <SuggestionCard suggestions={suggestions} onClose={handleCloseSuggestionCard}  />}
        </Router>
    );
};

export default App;
