/* eslint-disable @typescript-eslint/no-unused-vars */
// components/EventForm.tsx
"use client";
import { useState } from "react";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaPlus, FaArrowRight } from "react-icons/fa";
import CallForwardingInstructions from "./instruction";

interface EventFormProps {
  onClose: () => void;
}

export default function EventForm({ onClose }: EventFormProps) {
  const [eventType, setEventType] = useState("Call_fowarding");
  const [eventTypes, setEventTypes] = useState(["Message", "Voice Call" ,"Video call", "Images"]);
  const [showAddEventType, setShowAddEventType] = useState(false);
  const [newEventType, setNewEventType] = useState("");
  const [showCallForwarding, setShowCallForwarding] = useState(false);
  
  const handleAddEventType = () => {
    if (newEventType && !eventTypes.includes(newEventType)) {
      setEventTypes([...eventTypes, newEventType]);
      setEventType(newEventType);
      setNewEventType("");
    }
    setShowAddEventType(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const eventDetails = {
      name: formData.get("name") as string,
      type: eventType,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      location: formData.get("location") as string,
    };
    console.log("Event Details:", eventDetails); // Replace with API call
    // Instead of closing, show the CallForwardingInstructions
    setShowCallForwarding(true);
  };

  const handleCallForwardingBack = () => {
    setShowCallForwarding(false);
  };

  const handleCallForwardingComplete = () => {
    // Close everything when completed
    onClose();
  };

  // If showing CallForwardingInstructions, render that component
  if (showCallForwarding) {
    return (
      <CallForwardingInstructions 
        onBack={handleCallForwardingBack} 
        onComplete={handleCallForwardingComplete} 
      />
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">Register your Agent.</h2>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-800">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400"
            placeholder="Enter agent name"
          />
        </div>

        {/* Event Type */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-800">Monitoring Type</label>
          <div className="flex flex-wrap gap-3 mb-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEventType(type)}
                className={`px-4 py-3 rounded-lg border ${
                  eventType === type
                    ? "bg-indigo-100 border-indigo-500 text-indigo-800"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAddEventType(true)}
              className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>+ add</span>
            </button>
          </div>
          
          {showAddEventType && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                placeholder="Add new event type"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddEventType}
                className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Event Date */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-800">End Date</label>
          <div className="relative">
            <input
              type="text"
              name="date"
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400"
              placeholder="Select date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaCalendar />
            </div>
          </div>
        </div>

        {/* Event Time */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-800">Time</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                name="startTime"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400"
                placeholder="Start time"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />
            </div>
            <span className="text-gray-500 font-medium">To</span>
            <div className="relative flex-1">
              <input
                type="text"
                name="endTime"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400"
                placeholder="End time"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />
            </div>
          </div>
        </div>

        {/* Event Location */}
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2 text-gray-800">Add your phone number (Area Code) </label>
          <input
            type="number"
            name="Area Code"
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400"
            placeholder="(Area Code) +250......."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 flex items-center gap-2"
          >
            Continue <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}