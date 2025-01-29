import React from "react";
import "./DestinationModal.css"; // Import the CSS file

const DestinationModal = ({ destinations, onSelect }) => {
  return (
    <div className="destination-modal-overlay">
      <div className="destination-modal">
        <h2>Select Your Destination</h2>
        <ul>
          {destinations.map((destination) => (
            <li
              key={destination._id}
              className="destination-card"
              onClick={() => onSelect(destination)}
            >
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>
              <p>Distance: {destination.distance} km</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DestinationModal;
