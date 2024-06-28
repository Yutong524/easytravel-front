import React from 'react';

const CreateNewRouteStep4 = ({ onNext, onBack, onCancel }) => {
    return (
        <div className="create-new-route-step">
            <h2>Create New Route</h2>
            <p>Put this route in plan:</p>
            <div className="routeplan">
                <label>
                    <input type="radio" name="routeplan" value="San Fransisco"/>
                    San Fransisco
                </label>
                <label>
                    <input type="radio" name="routeplan" value="(No Plan)"/>
                    (No Plan)
                </label>
            </div>
            <div className="priority">
                <label>
                    <input type="radio" name="priority" value="First Priority"/>
                    First Priority
                </label>
                <label>
                    <input type="radio" name="priority" value="Second Priority"/>
                    Second Priority
                </label>
                <label>
                    <input type="radio" name="priority" value="No Priority"/>
                    No Priority
                </label>
            </div>
            <div className="buttons">
                <button onClick={onBack}>Back</button>
                <button onClick={onNext}>Next</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateNewRouteStep4;

