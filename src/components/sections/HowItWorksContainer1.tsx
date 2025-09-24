"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const StripeAnimatedGrid = dynamic(() => import('./StripeAnimatedGrid'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>
});

const HowItWorksContainer1 = () => {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-3xl overflow-visible">
      <div className="w-full h-full flex items-center justify-center max-w-none">
        <StripeAnimatedGrid />
      </div>
    </div>
  );
};

export default HowItWorksContainer1;