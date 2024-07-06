import React from 'react';
import './Meeting.css';

const Meeting = ({ meetLink, onCancel }) => {
  return (
    <div className="meeting-container">
      <div className="meeting-card">
        <h1>Hi, {'name'}</h1>
        <p>Please join the meeting by clicking on this link</p>
        <a href={meetLink}>Go to Meeting</a>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default Meeting;
