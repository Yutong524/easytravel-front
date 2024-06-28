import React from 'react';

const CreateNewRouteFinalStep = ({ onBack, onCancel, onApply }) => {
    return (
        <div className="create-new-route-step">
            <button onClick={onBack}>Back</button>
            <h2>Create New Route</h2>
            <button>Generate Route Automatically</button>
            <hr />
            <button>Manually Arrange Your Route</button>
            <div className="day-section">
                <h3>Day 1 (Jue 10, 2024)</h3>
                <div className="activity">
                    <span className="activity-name">Golden Gate Bridge</span>
                    <span className="activity-time">10:00 - 12:00</span>
                </div>
            </div>
            <div className="day-section">
                <h3>Day 2 (Jue 11, 2024)</h3>
                <div className="activity">
                    <span className="activity-name">The Palace of Fine Arts</span>
                    <span className="activity-time">13:00 - 17:00</span>
                </div>
            </div>
            <div className="buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onApply}>Apply</button>
            </div>
        </div>
    );
};

export default CreateNewRouteFinalStep;
