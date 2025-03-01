/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CallForwardingInstructions.tsx
"use client";
import { useState } from "react";
import { Cog, TextCursor, ChevronLeft, ChevronRight } from "lucide-react";

interface CallForwardingInstructionsProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CallForwardingInstructions({ onBack, onComplete }: CallForwardingInstructionsProps) {
  const [activeTab, setActiveTab] = useState<"device_specific" | "carrier_specific">("device_specific");
  const [deviceType, setDeviceType] = useState<"iphone" | "android">("iphone");
  const [selectedCarrier, setSelectedCarrier] = useState({
    carrier: "",
    condition: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: null as any
  });

  // Mock icons data
  const iphoneIcons = {
    settings: "/assets/icons/settings.svg",
    phone: "/assets/icons/phone.svg",
    switch: "/assets/icons/switch.png"
  };
  
  const androidIcons = {
    simcard: "/assets/icons/simcard.png"
  };

  // Mock carrier data
  const carrierOptions = [
    { id: "mtn", carrier: "mtn-rwanda" },
    { id: "Safaricom", carrier: "Safaricom" },
    { id: "airtel", carrier: "Airtel" },
  ];

  const conditionOptions = {
    mtn: ["all_calls", "when_busy", "no_answer", "unreachable", "unknown_calls"],
    Safaricom: ["all_calls", "when_busy", "no_answer"],
    airtel: ["all_calls", "when_busy", "no_answer", "unreachable"],
  };

  const getCarrierConditions = (carrierId: string) => {
    return carrierId ? (conditionOptions as any)[carrierId] || [] : [];
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Call Forwarding Setup</h2>
      </div>

      {/* Tab selector */}
      <div className="flex mb-5 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("device_specific")}
          className={`py-2 px-4 mr-2 ${
            activeTab === "device_specific" 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Device Instructions
        </button>
        <button
          onClick={() => setActiveTab("carrier_specific")}
          className={`py-2 px-4 mr-2 ${
            activeTab === "carrier_specific" 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Carrier Specific
        </button>
      </div>

      {activeTab === "device_specific" && (
        <div className="w-full mt-2">
          {/* Device type selector */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setDeviceType("iphone")}
              className={`px-4 py-2 rounded-lg ${
                deviceType === "iphone"
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => setDeviceType("android")}
              className={`px-4 py-2 rounded-lg ${
                deviceType === "android"
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              Android
            </button>
          </div>

          {/* Instructions */}
          <div className="w-full">
            <h3 className="text-md font-medium text-gray-800">
              For {deviceType === "iphone" ? "iPhone" : "Android"} users
            </h3>
            <p className="text-xs text-gray-500">
              To forward all incoming calls.
            </p>

            <div className="mt-5 space-y-10">
              {deviceType === "iphone" ? (
                <>
                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <img src={iphoneIcons.settings} alt="Settings" width={30} height={30} />
                    <span className="text-sm text-gray-600 ml-3">
                      Go to your phone <span className="font-medium text-gray-800">Settings</span>
                    </span>
                  </div>

                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <img src={iphoneIcons.phone} alt="Phone" width={30} height={30} />
                    <span className="text-sm text-gray-600 ml-3">
                      Scroll down to <span className="font-medium text-gray-800">Phone</span>
                    </span>
                  </div>

                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <img src={iphoneIcons.switch} alt="Switch" width={45} height={30} />
                    <span className="text-sm text-gray-600 ml-3">
                      Select <span className="font-medium text-gray-800">Call Forwarding</span> and turn it on.
                    </span>
                  </div>

                  <div className="flex items-start">
                    <TextCursor size={25} className="text-amber-600" />
                    <span className="text-sm text-gray-600 ml-3">
                      Type in the number you just purchased. <span className="font-medium text-gray-800">+1 (229) 629-6959</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <img src={iphoneIcons.phone} alt="Phone" width={30} height={30} />
                    <span className="text-sm text-gray-600 ml-3">
                      Go to your <span className="font-medium text-gray-800">Phone</span> app
                    </span>
                  </div>

                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <Cog size={25} className="text-amber-600" />
                    <span className="text-sm text-gray-600 ml-3">
                      Go to your phone <span className="font-medium text-gray-800">Settings</span> (located in the top right corner)
                    </span>
                  </div>

                  <div className="flex items-start relative before:content-[''] before:absolute before:-bottom-6 before:left-3 before:w-[1.5px] before:h-[15px] before:bg-gray-300">
                    <img src={androidIcons.simcard} alt="SIM card" width={30} height={30} />
                    <span className="text-sm text-gray-600 ml-3">
                      Select <span className="font-medium text-gray-800">SIM card settings</span> and select carrier features. Select Call forwarding.
                    </span>
                  </div>

                  <div className="flex items-start">
                    <TextCursor size={25} className="text-amber-600" />
                    <span className="text-sm text-gray-600 ml-3">
                      Type in the number you just purchased. <span className="font-medium text-gray-800">+250 555-123-4567</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "carrier_specific" && (
        <div className="w-full mt-2">
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <select
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm focus:border-indigo-500 focus:outline-none"
              onChange={(e) => {
                setSelectedCarrier(prev => ({
                  ...prev,
                  carrier: e.target.value,
                  condition: ""
                }));
              }}
            >
              <option value="">Select Carrier Provider</option>
              {carrierOptions.map((cf) => (
                <option key={cf.id} value={cf.id}>
                  {cf.carrier}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedCarrier.carrier}
              onChange={(e) => {
                setSelectedCarrier(prev => ({
                  ...prev,
                  condition: e.target.value
                }));
              }}
            >
              <option value="">Select Condition</option>
              {selectedCarrier.carrier && getCarrierConditions(selectedCarrier.carrier).length > 0 ? (
                getCarrierConditions(selectedCarrier.carrier).map((c: string) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, ' ')}
                  </option>
                ))
              ) : (
                <option value="">No conditions</option>
              )}
            </select>
          </div>

          {selectedCarrier.carrier && selectedCarrier.condition && (
            <div className="mt-5 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-bold text-gray-800">
                {carrierOptions.find(c => c.id === selectedCarrier.carrier)?.carrier} Instructions
              </h3>
              <div className="text-sm text-gray-600">
                <p className="mb-3">
                  <span className="text-gray-800 font-medium">Activate:</span> To activate call forwarding
                  <span className="px-2 py-1 mx-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md">
                    {selectedCarrier.condition.replace(/_/g, ' ')}
                  </span>
                  dial the following code:
                </p>
                <p className="px-3 py-2 text-md font-mono font-bold text-indigo-700 bg-indigo-50 rounded-md mb-4 border border-indigo-100">
                  *72 +250 555-123-4567
                </p>
                
                <p className="mb-3">
                  <span className="text-gray-800 font-medium">Deactivate:</span> To deactivate call forwarding, dial:
                </p>
                <p className="px-3 py-2 text-md font-mono font-bold text-indigo-700 bg-indigo-50 rounded-md border border-indigo-100">
                  *73
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-5 py-3 font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <ChevronLeft className="mr-1" size={18} /> Back
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 flex items-center"
        >
          Complete <ChevronRight className="ml-1" size={18} />
        </button>
      </div>
    </div>
  );
}