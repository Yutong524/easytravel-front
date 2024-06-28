import React from 'react';

const CreateNewRouteStep2 = ({ onNext, onBack, onCancel }) => {
    return (
        <div className="create-new-route-step">
            <h2>Create New Route</h2>
            <p>Select days for your travel (1~15 days)</p>
            <div className="calendar">
                <div className="days">S M T W T F S</div>
                <div className="dates">
                    <span>26 27 28 29 30 31 1</span>
                    <span>2 3 4 5 6 7 8</span>
                    <span>9 10 11 12 13 14 15</span>
                    <span>16 17 18 19 20 21 22</span>
                    <span>23 24 25 26 27 28 29</span>
                    <span>30 1 2 3 4 5 6</span>
                </div>
            </div>
            <div className="buttons">
                <button onClick={onBack}>Back</button>
                <button onClick={onNext}>Next</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateNewRouteStep2;

