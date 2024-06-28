import React from 'react';

const CreateNewRouteStep5 = ({ onBack, onCancel, onApply }) => {
    return (
        <div className="create-new-route-step">
            <button onClick={onBack}>Back</button>
            <h2>Create New Route</h2>
            <button>Generate Route Automatically</button>
            <hr />
            <button>Manually Arrange Your Route</button>
            <div className="buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onApply}>Apply</button>
            </div>
        </div>
    );
};

export default CreateNewRouteStep5;
