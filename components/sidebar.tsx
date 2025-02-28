/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import * as allIcons from "tabler-icons-react";
import { formatDistanceToNow } from 'date-fns';
import ScamVoiceDetailsSidebar from '@/components/ScamVoicePopUp';
import { Input } from '@/components/ui/input';
import { getThreatBadgeColor, getThreatLevel } from '@/app/lib/maputils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export interface Call {
  id: string;
  shortSummary: string;
  detailedSummary: string;
  icon: string;
  callStatus: string;
  createdDate: Date;
  fearLevel: number;
  stressLevel: number;
  location: {
    lat: number;
    lng: number;
  };
  transcript: Array<{
    Role: string;
    Message: string;
  }>;
  isSuspicious?: boolean; // New field to indicate suspicious calls
}

interface SidebarProps {
  onCallSelect: (call: Call) => void;
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const Sidebar: React.FC<SidebarProps> = ({ onCallSelect }) => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Starting Firestore connection...');
    const fetchCalls = async () => {
      try {
        const callsRef = collection(db, 'calls');
        console.log('Collection reference created');
        const querySnapshot = await getDocs(callsRef);
        console.log('Raw Firestore data:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const callsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing document:', doc.id, data);
          const mappedTranscript = data.Transcript?.map((entry: { Role: any; Message: any; }) => ({
            Role: entry.Role,
            Message: entry.Message
          })) || [];
          console.log("transcript", mappedTranscript);
          return {
            id: doc.id,
            shortSummary: data.ShortSummary || 'No Summary',
            detailedSummary: data.DetailedSummary || '',
            icon: data.icon || 'Activity',
            callStatus: data.CallStatus || 'active',
            createdDate: new Date(),
            fearLevel: data.FearLevel || 0,
            stressLevel: data.StressLevel || 0,
            location: { lat: data.Location.Lat || -1.9344642081495684, lng: data.Location.Lng || 30.14847027961296 },
            transcript: mappedTranscript,
            isSuspicious: data.isSuspicious || false, // Default to false if not provided
          } as Call;
        });
        console.log('Processed calls data:', callsData);
        setCalls(callsData);
        setFilteredCalls(callsData);
      } catch (err) {
        console.error('Error fetching calls:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    fetchCalls();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = calls.filter(call => 
      call.shortSummary.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCalls(filtered);
  }, [searchTerm, calls]);

  const sortedCalls = [...filteredCalls].sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
  const totalIncidents = calls.length;
  const resolvedIncidents = calls.filter(call => call.callStatus !== "active").length;
  const criticalIncidents = calls.filter(call => getThreatLevel(call.fearLevel, call.stressLevel) === "high").length;
  const suspiciousIncidents = calls.filter(call => call.isSuspicious).length; // Count suspicious calls

  return (
    <>
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col p-4 select-none h-screen overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-black text-lg font-semibold">SCAMCALL</h2>
          <p className="text-gray-600 text-sm">AI-Agent that protect your business of suspicious and scam voice calls.</p>
        </div>

        <div className="mb-6 flex justify-between text-center">
          <div>
            <p className="text-3xl font-bold text-black">{totalIncidents}</p>
            <p className="text-sm text-gray-500">Total Calls</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{criticalIncidents}</p>
            <p className="text-sm text-gray-500">High Threat</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{resolvedIncidents}</p>
            <p className="text-sm text-gray-500">Resolved</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{suspiciousIncidents}</p>
            <p className="text-sm text-gray-500">Suspicious</p>
          </div>
        </div>

        <Input
          type="text"
          placeholder="Search calls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
        />

        <h3 className="text-black font-bold mb-2">Recent Calls</h3>

        <div className="flex-1">
          {sortedCalls.map((call) => {
            const IconToBeUsed = allIcons[call.icon as keyof typeof allIcons] || allIcons.Activity;
            const threatLevel = getThreatLevel(call.fearLevel, call.stressLevel);

            return (
              <div 
                key={call.id}
                className={`mb-2 p-2 rounded-lg ${
                  call.isSuspicious ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors cursor-pointer`}
                onClick={() => onCallSelect(call)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconToBeUsed size={26} className={`${call.isSuspicious ? 'text-red-600' : 'text-black'}`} />
                    <div>
                      <p className={`${call.isSuspicious ? 'text-red-800' : 'text-gray-800'}`}>{call.shortSummary}</p>
                      <p className="text-xs text-gray-500">{formatDistanceToNow(call.createdDate, { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getThreatBadgeColor(threatLevel)} text-xs`}>
                      {threatLevel}
                    </Badge>
                    {call.callStatus === "active" && (
                      <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                        Live
                      </div>
                    )}
                    {call.isSuspicious && (
                      <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                        Suspicious
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            Built by{' '}
            <a href="https://twitter.com/freedisch" className="underline text-black">Freedisch</a>
          </p>
        </div>
      </div>

      {selectedCall && (
        <ScamVoiceDetailsSidebar
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </>
  );
};

export default Sidebar;