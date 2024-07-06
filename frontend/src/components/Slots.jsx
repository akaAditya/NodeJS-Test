import React, { useState } from "react";
import './Slots.css';

const Slots = ({ onSlotSelect }) => {
  const [slots, setSlots] = useState([
    { time: "02:00 PM", availableSlots: 4 },
    { time: "02:30 PM", availableSlots: 4 },
    { time: "03:00 PM", availableSlots: 4 },
    { time: "03:30 PM", availableSlots: 4 },
  ]);

  const bookSlot = (index) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot, i) =>
        i === index && slot.availableSlots > 0
          ? { ...slot, availableSlots: slot.availableSlots - 1 }
          : slot
      )
    );
    onSlotSelect(index, slots[index].time);
  };

  return (
    <div className="container">
      {slots.map((slot, index) => (
        <div key={index} className="card">
          <h3>{slot.time}</h3>
          <p>Available Slots: {slot.availableSlots}</p>
          <button
            className="button"
            onClick={() => bookSlot(index)}
            disabled={slot.availableSlots === 0}
          >
            Book Slot
          </button>
        </div>
      ))}
    </div>
  );
};

export default Slots;
