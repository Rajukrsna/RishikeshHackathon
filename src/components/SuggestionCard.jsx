import React from 'react';
import './SuggestionCard.css';

const SuggestionCard = ({ suggestions , onClose}) => {
    console.log("Suggestions received in SuggestionCard:", suggestions); // Verify data is passed correctly

    const suggestionsArray = suggestions?.suggestions || []; // Ensure suggestions is an array, fallback to empty array

    return (
        <div className="suggestion-card">
                        <button className="close-btn" onClick={onClose}>X</button>

            <h3>Suggestions</h3>
            
            {suggestionsArray.length === 0 ? (
                <p>No suggestions available.</p>
            ) : (
                <ul>
                    {suggestionsArray.map((suggestion, index) => (
                        <li key={index} className="suggestion-item">
                            <h4><strong>{suggestion.activity}</strong></h4>
                            <p><strong>Budget:</strong> {suggestion.budgetRange}</p>
                            <p><strong>Eco Tips:</strong> {suggestion.ecoTips}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SuggestionCard;
