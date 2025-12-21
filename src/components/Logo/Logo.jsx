import React from 'react';

const Logo = () => {
    return (
          <div className="flex items-center gap-1">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20 4C20 4 10 14 10 22C10 27.5228 14.4772 32 20 32C25.5228 32 30 27.5228 30 22C30 14 20 4 20 4Z" 
          fill="#DC2626"
        />
        <path 
          d="M13 20H16L18 17L20 23L22 17L24 20H27" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-2xl font-bold text-gray-800">
        Vital-Drop
      </span>
    </div>
    );
};

export default Logo;