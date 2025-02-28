// pages/index.tsx or app/page.tsx (depending on your Next.js version)
"use client"
import Sidebar from "@/components/sidebar";
import Map from "@/components/map"
import { useState } from "react";
import { Call } from '@/components/sidebar'; 
import LiveTranscript from "@/components/livetranscript";
import ScamVoiceDetails from "@/components/ScamVoiceDetailsPopup";


export default function Home() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  return (
    <main className="flex h-screen bg-white">
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