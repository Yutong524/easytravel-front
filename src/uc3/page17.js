import React, { useState, useEffect } from 'react';
import { Button, DatePicker, TimePicker, message, Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import './page12.css';

const { RangePicker } = DatePicker;

const CreateNewRouteStep6 = ({ prevPlan, routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, priority, onCreate, onBack, onCancel }) => {
  const [poiSchedules, setPoiSchedules] = useState(selectedPlaces.map(poi => ({ ...poi, date: null, startTime: null, endTime: null })));
  const [showWarning, setShowWarning] = useState(false);

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...poiSchedules];
    newSchedules[index][field] = value;
    setPoiSchedules(newSchedules);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(poiSchedules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPoiSchedules(items);
  };

  const validateSchedules = () => {
    for (let i = 0; i < poiSchedules.length; i++) {
      const { date, startTime, endTime, openTime } = poiSchedules[i];
      const selectedDate = moment(date).format('dddd').toUpperCase();
      const openingHours = openTime.find(day => day.day === selectedDate);
      if (!openingHours) {
        message.error(`POI is not open on ${selectedDate}.`);
        return false;
      }
      const openStart = moment(openingHours.startTime, 'HH-mm-ss');
      const openEnd = moment(openingHours.endTime, 'HH-mm-ss');
      const visitStart = moment(startTime, 'HH:mm:ss');
      const visitEnd = moment(endTime, 'HH:mm:ss');
      if (!visitStart.isBetween(openStart, openEnd, null, '[)') || !visitEnd.isBetween(openStart, openEnd, null, '(]')) {
        message.error(`Visit time for POI ${poiSchedules[i].name} on ${selectedDate} is outside of its opening hours.`);
        return false;
      }
      if (visitEnd.isBefore(visitStart)) {
        message.error(`End time for POI ${poiSchedules[i].name} must be after start time.`);
        return false;
      }
    }

    for (let i = 1; i < poiSchedules.length; i++) {
      const prevEndTime = moment(poiSchedules[i - 1].endTime, 'HH:mm:ss');
      const nextStartTime = moment(poiSchedules[i].startTime, 'HH:mm:ss');
      if (nextStartTime.diff(prevEndTime, 'minutes') < 60) {
        setShowWarning(true);
        return false;
      }
    }

    if (isOrdered) {
      for (let i = 1; i < poiSchedules.length; i++) {
        const prevEndTime = moment(poiSchedules[i - 1].endTime, 'HH:mm:ss');
        const nextStartTime = moment(poiSchedules[i].startTime, 'HH:mm:ss');
        if (nextStartTime.isBefore(prevEndTime)) {
          message.error(`The order of POIs must be followed in the sense of time.`);
          return false;
        }
      }
    }

    const visitDates = poiSchedules.map(poi => moment(poi.date).format('YYYY-MM-DD'));
    for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
      if (!visitDates.includes(m.format('YYYY-MM-DD'))) {
        setShowWarning(true);
        return false;
      }
    }

    return true;
  };

  const handleCreateClick = () => {
    if (validateSchedules()) {
      onCreate(routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, priority, poiSchedules, 'confirm');
    }
  };

  const handleWarningOk = () => {
    setShowWarning(false);
    onCreate(routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, priority, poiSchedules);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
  };

  return (
    <div className="create-new-route-step">
      <h2>Review and Schedule POIs</h2>
      <p>Provide visit times for the selected POIs:</p>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="poiSchedules" isDropDisabled={isOrdered}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {poiSchedules.map((poi, index) => (
                <Draggable key={poi.id} draggableId={poi.id.toString()} index={index} isDragDisabled={isOrdered}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="poi-schedule">
                      <h3>{poi.name}</h3>
                      <p style={{ fontSize: 'small' }}>{poi.address}</p>
                      <DatePicker
                        value={poi.date ? moment(poi.date) : null}
                        disabledDate={(current) => current && (current < moment(startDate) || current > moment(endDate))}
                        onChange={(date) => handleScheduleChange(index, 'date', date ? date.format('YYYY-MM-DD') : null)}
                      />
                      <TimePicker
                        value={poi.startTime ? moment(poi.startTime, 'HH:mm:ss') : null}
                        format="HH:mm:ss"
                        onChange={(time) => handleScheduleChange(index, 'startTime', time ? time.format('HH:mm:ss') : null)}
                      />
                      <TimePicker
                        value={poi.endTime ? moment(poi.endTime, 'HH:mm:ss') : null}
                        format="HH:mm:ss"
                        onChange={(time) => handleScheduleChange(index, 'endTime', time ? time.format('HH:mm:ss') : null)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleCreateClick}>Next</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
      <Modal
        title="Warning"
        visible={showWarning}
        onOk={handleWarningOk}
        onCancel={handleWarningCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>There are some potential issues with your schedule:</p>
        <p>- Plan is too hasty with less than 1 hour between visits.</p>
        <p>- There is a day with no POI visit at all.</p>
        <p>Are you sure you want to create this route?</p>
      </Modal>
    </div>
  );
};

export default CreateNewRouteStep6;



