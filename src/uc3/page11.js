import React, { useState } from 'react';
import { DatePicker, Button, Typography } from 'antd';
import moment from 'moment';
import './page12.css';

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

const CreateNewRouteStep2 = ({ prevPlan, routeName, onBack, onCancel, onNext }) => {
  const [dates, setDates] = useState([]);
  const [error, setError] = useState('');

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  const handleDateChange = (value) => {
    setDates(value);
    setError('');
  };

  const handleNextClick = () => {
    if (!dates || dates.length !== 2) {
      setError('Please select a valid date range.');
      return;
    }

    const startDate = dates[0];
    const endDate = dates[1];
    const duration = moment.duration(endDate.diff(startDate)).days() + 1;

    if (duration < 1 || duration > 15) {
      setError('The duration between start date and end date must be between 1 and 15 days.');
      return;
    }

    setError('');
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    onNext(routeName, formattedStartDate, formattedEndDate);
  };

  return (
    <div className="create-new-route-step">
      <Title level={2}>Create New Route</Title>
      <Paragraph>Select days for your travel (1~15 days)</Paragraph>
      <RangePicker
        disabledDate={disabledDate}
        onChange={handleDateChange}
        className="range-picker"
      />
      {error && <p className="error-message">{error}</p>}
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleNextClick}>Next</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep2;
