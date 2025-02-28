// pages/index.tsx or app/page.tsx (depending on your Next.js version)
"use client";
import Sidebar from "@/components/sidebar";
import Map from "@/components/map";
import { useState } from "react";
import { Call } from "@/components/sidebar";
import LiveTranscript from "@/components/livetranscript";
import ScamVoiceDetails from "@/components/ScamVoiceDetailsPopup";
import EventForm from "@/components/EventForm"; // Import the EventForm component

export default function Home() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showEventForm, setShowEventForm] = useState(true); // Control visibility of the EventForm pop-up

  return (
    <main className="flex h-screen bg-white">
      {/* EventForm Pop-Up */}
      {showEventForm && (
        <>
          {/* Blur Background */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>

          {/* EventForm */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <EventForm onClose={() => setShowEventForm(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <Sidebar onCallSelect={setSelectedCall} />
      <div className="flex-1 relative">
        <Map selectedCall={selectedCall} />
        {selectedCall && (
          <div className="absolute top-0 right-0 bottom-0 flex">
            <ScamVoiceDetails
              call={selectedCall}
              onClose={() => setSelectedCall(null)}
            />
            <LiveTranscript
              call={selectedCall}
              onClose={() => setSelectedCall(null)}
            />
          </div>
        )}
      </div>
    </main>
  );
}