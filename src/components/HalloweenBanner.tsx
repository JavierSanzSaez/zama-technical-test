import React, { useState } from 'react';

export const HalloweenBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white mb-6 rounded-lg overflow-hidden shadow-lg">
      {/* Halloween decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="flex items-center justify-center h-full text-6xl">
          🎃 🦇 👻 🕷️ 🎃 🦇 👻 🕷️ 🎃 🦇 👻 🕷️
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative px-6 py-4 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎃</span>
              <h3 className="text-lg md:text-xl font-bold">
                Halloween Special: Spooktacular Savings!
              </h3>
              <span className="text-2xl">👻</span>
            </div>
            
            <p className="text-sm md:text-base mb-3 opacity-90">
              Get <span className="font-bold text-yellow-200 text-lg">31% OFF</span> all premium API plans! 
              Limited time offer until November 2nd - Don't let this deal vanish into thin air! 🦇
            </p>

          </div>
          
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-white hover:text-yellow-200 transition-colors p-1 rounded-full hover:bg-black hover:bg-opacity-20"
            title="Close banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Halloween themed border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
      </div>
      
    </div>
  );
};