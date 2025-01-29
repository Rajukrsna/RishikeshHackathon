import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaMapMarkedAlt, FaUser, FaListAlt } from 'react-icons/fa'; // FontAwesome icons

const Navbar = ({ onStartJourney }) => {
    return (
        <nav className="navbar">
            <img
                src="/rishh.png"
                alt="Logo"
                className="navbar-logo"
            />
            <h1 className="navbar-title">Rishikesh Explorer</h1>

            <div className="navbar-menu">
                <button onClick={onStartJourney} className="navbar-button">
                    Start Journey
                </button>

                <Link to="/" className="navbar-item">
                    <FaMapMarkedAlt className="navbar-item-icon" />
                    Map
                </Link>

                <Link to="/activities" className="navbar-item">
                    <FaListAlt className="navbar-item-icon" />
                    Activities
                </Link>

                <Link to="/profile" className="navbar-item">
                    <FaUser className="navbar-item-icon" />
                    Profile
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
