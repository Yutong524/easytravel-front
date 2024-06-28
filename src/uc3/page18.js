import React, { useState } from 'react';

const CreateNewRouteStep7 = ({ onBack, onCancel, onCreate }) => {
        const [date1, setDate1] = useState('');
        const [time1, setTime1] = useState('');
        const [date2, setDate2] = useState('');
        const [time2, setTime2] = useState('');

        return (
            <div className="create-new-route-step">
                    <button onClick={onBack}>Back</button>
                    <h2>Create New Route</h2>
                    <div className="activity">
                            <h3>Golden Gate Bridge</h3>
                            <div className="details">
                                    <span>Date: </span>
                                    <input
                                        type="text"
                                        value={date1}
                                        onChange={(e) => setDate1(e.target.value)}
                                        placeholder="YY/MM/DD"
                                    />
                                    <span>Time: </span>
                                    <input
                                        type="text"
                                        value={time1}
                                        onChange={(e) => setTime1(e.target.value)}
                                        placeholder="HH:mm"
                                    />
                            </div>
                    </div>
                    <div className="activity">
                            <h3>The Palace of Fine Arts</h3>
                            <div className="details">
                                    <span>Date: </span>
                                    <input
                                        type="text"
                                        value={date2}
                                        onChange={(e) => setDate2(e.target.value)}
                                        placeholder="YY/MM/DD"
                                    />
                                    <span>Time: </span>
                                    <input
                                        type="text"
                                        value={time2}
                                        onChange={(e) => setTime2(e.target.value)}
                                        placeholder="HH:mm"
                                    />
                            </div>
                    </div>
                    <div className="buttons">
                            <button onClick={onCancel}>Cancel</button>
                            <button onClick={onCreate}>Create</button>
                    </div>
            </div>
        );
};

export default CreateNewRouteStep7;
