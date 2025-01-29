import React, { useState } from 'react';
import './Modal.css'; // Import the CSS file

const Modal = ({ onSubmit }) => {
    const [type, setType] = useState('');
    const [budget, setBudget] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [travelType, setTravelType] = useState('solo');
    const [plasticBottles, setPlasticBottles] = useState({ has: 'no', count: 0 });
    const [plasticCovers, setPlasticCovers] = useState({ has: 'no', count: 0 });
    const [otherItems, setOtherItems] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the data to send
        const luggageData = {
            type,
            budget,
            numPeople,
            travelType,
            plasticBottles,
            plasticCovers,
            otherItems,
        };

        onSubmit(luggageData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2 className="modal-title">Start Your Journey</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label className="modal-label">
                        Journey Type:
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="modal-select"
                        >
                            <option value="adventure">Adventure</option>
                            <option value="spiritual">Spiritual</option>
                            <option value="wellness">Wellness</option>
                        </select>
                    </label>

                    <label className="modal-label">
                        Budget (in USD):
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Enter your budget"
                            className="modal-input"
                        />
                    </label>

                    <label className="modal-label">
                        Number of People:
                        <input
                            type="number"
                            value={numPeople}
                            onChange={(e) => setNumPeople(e.target.value)}
                            min="1"
                            className="modal-input"
                        />
                    </label>

                    <label className="modal-label">
                        Are you traveling solo or in a group?
                        <select
                            value={travelType}
                            onChange={(e) => setTravelType(e.target.value)}
                            className="modal-select"
                        >
                            <option value="solo">Solo</option>
                            <option value="group">Group</option>
                        </select>
                    </label>

                    <div className="modal-sustainability">
                        <label className="modal-label">
                            Do you have plastic bottles?
                            <div className="modal-radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="plasticBottles"
                                        value="yes"
                                        checked={plasticBottles.has === 'yes'}
                                        onChange={() =>
                                            setPlasticBottles({ ...plasticBottles, has: 'yes' })
                                        }
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="plasticBottles"
                                        value="no"
                                        checked={plasticBottles.has === 'no'}
                                        onChange={() =>
                                            setPlasticBottles({ ...plasticBottles, has: 'no', count: 0 })
                                        }
                                    />
                                    No
                                </label>
                            </div>
                            {plasticBottles.has === 'yes' && (
                                <input
                                    type="number"
                                    placeholder="Enter count"
                                    value={plasticBottles.count}
                                    onChange={(e) =>
                                        setPlasticBottles({ ...plasticBottles, count: e.target.value })
                                    }
                                    className="modal-input"
                                />
                            )}
                        </label>

                        <label className="modal-label">
                            Do you have plastic covers?
                            <div className="modal-radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="plasticCovers"
                                        value="yes"
                                        checked={plasticCovers.has === 'yes'}
                                        onChange={() =>
                                            setPlasticCovers({ ...plasticCovers, has: 'yes' })
                                        }
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="plasticCovers"
                                        value="no"
                                        checked={plasticCovers.has === 'no'}
                                        onChange={() =>
                                            setPlasticCovers({ ...plasticCovers, has: 'no', count: 0 })
                                        }
                                    />
                                    No
                                </label>
                            </div>
                            {plasticCovers.has === 'yes' && (
                                <input
                                    type="number"
                                    placeholder="Enter count"
                                    value={plasticCovers.count}
                                    onChange={(e) =>
                                        setPlasticCovers({ ...plasticCovers, count: e.target.value })
                                    }
                                    className="modal-input"
                                />
                            )}
                        </label>

                        <label className="modal-label">
                            Other Items (if any):
                            <textarea
                                value={otherItems}
                                onChange={(e) => setOtherItems(e.target.value)}
                                placeholder="E.g., electronic waste, glass bottles, etc."
                                className="modal-textarea"
                            ></textarea>
                        </label>
                    </div>

                    <button type="submit" className="modal-submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
