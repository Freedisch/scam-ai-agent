// components/LiveTranscript.tsx
'use client';

import React from 'react';
import { X } from 'tabler-icons-react';
import { Call } from '@/components/sidebar';

interface LiveTranscriptProps {
  call: Call;
  onClose: () => void;
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ call, onClose }) => {
  return (
    <div className="w-96 bg-white text-gray-800 shadow-lg z-[1000] flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Live Transcript</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </div>
      
      <div className="p-4 bg-green-100 text-red-800 flex items-center">
        <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
        <span>AI Operator Connected</span>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">CALLER EMOTION</h3>
          <p className="font-bold text-xl mb-1">Fear</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${call.fearLevel}%` }}></div>
          </div>
          <span className="text-sm text-gray-500">{call.fearLevel}%</span>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">CALLER EMOTION</h3>
          <p className="font-bold text-xl mb-1">Confusion</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${call.stressLevel}%` }}></div>
          </div>
          <span className="text-sm text-gray-500">{call.stressLevel}%</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">CALL TRANSCRIPT</h3>
        {call.transcript.map((entry, index) => (
          <div key={index} className={`mb-4 ${entry.Role === 'user' ? '' : 'flex'}`}>
            {entry.Role === 'agent' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                <span className="text-gray-600">🤖</span>
              </div>
            )}
            <div className={`${entry.Role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg inline-block max-w-[80%]`}>
              {entry.Message}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
          Transfer
        </button>
      </div>
    </div>
  );
};

export default LiveTranscript;