import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Forms from "./components/Forms";
import Slots from "./components/Slots";
import Meeting from "./components/Meeting";

function App() {
  const [meetLink, setMeetLink] = useState("");
  const [currentView, setCurrentView] = useState("slots");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotSelection = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setCurrentView("form");
  };

  const handleFormSubmit = async (name, email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000",
        { name, email }
      );
      setMeetLink(response.data.meetLink);
      setCurrentView("meeting");
    } catch (error) {
      console.error("Error creating meeting", error);
    }
  };

  const handleCancelMeeting = () => {
    setMeetLink("");
    setCurrentView("slots");
    setSelectedSlot(null);
  };

  return (
    <div className="App">
      {currentView === "slots" && (
        <Slots onSlotSelect={handleSlotSelection} />
      )}
      {currentView === "form" && (
        <Forms onSubmit={handleFormSubmit} />
      )}
      {currentView === "meeting" && (
        <Meeting meetLink={meetLink} onCancel={handleCancelMeeting} />
      )}
    </div>
  );
}

export default App;
