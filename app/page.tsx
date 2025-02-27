// pages/index.tsx or app/page.tsx (depending on your Next.js version)
"use client"
import Sidebar from "@/app/components/sidebar";
import Map from "@/app/components/map"
import { useState } from "react";
import { Call } from '@/app/components/sidebar'; 
import VoiceCallsDetails from "@/app/components/voiceCallDetailsPopup";
import LiveTranscript from "@/app/components/livetranscript";


export default function Home() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  return (
    <main className="flex h-screen bg-gray-900">
      <Sidebar onCallSelect={setSelectedCall} />
      <div className="flex-1 relative">
        <Map selectedCall={selectedCall} />
        {selectedCall && (
          <div className="absolute top-0 right-0 bottom-0 flex">
            <VoiceCallsDetails
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