import React, { useState } from 'react';

const CreateNewRouteStep3 = ({ onNext, onBack, onCancel, selectedPlaces, setSelectedPlaces }) => {
    const [places] = useState(["Golden Gate Bridge", "The Palace of Fine Arts"]);

    const handlePlaceClick = (place) => {
        setSelectedPlaces([...selectedPlaces, place]);
    };

    return (
        <div className="create-new-route-step">
            <h2>Create New Route</h2>
            <p>Add Places to visit:</p>
            <div className="selected-places">
                {selectedPlaces.length === 0 ? (
                    <p>You don't have places to visit yet!</p>
                ) : (
                    <ul>
                        {selectedPlaces.map((place, index) => (
                            <li key={index}>{place}</li>
                        ))}
                    </ul>
                )}
                <button onClick={() => setSelectedPlaces([])}>Make it unordered</button>
            </div>
            <p>Add from your favourite list:</p>
            <ul className="favourite-list">
                {places.map((place, index) => (
                    <li key={index} onClick={() => handlePlaceClick(place)}>
                        {place}
                    </li>
                ))}
            </ul>
            <p>Or Search to add:</p>
            <input type="text" placeholder="Search" />
            <div className="buttons">
                <button onClick={onBack}>Back</button>
                <button onClick={onNext}>Next</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateNewRouteStep3;

