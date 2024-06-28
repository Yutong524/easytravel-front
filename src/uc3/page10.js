import React from 'react';

const CreateNewRouteStep1 = ({ onNext, onCancel }) => {
    return (
        <div className="create-new-route-step">
            <h2>Create New Route</h2>
            <input type="text" placeholder="Provide a name for your travel route" />
            <div className="buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default CreateNewRouteStep1;
