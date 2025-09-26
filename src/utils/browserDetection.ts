/**
 * Browser detection utilities for Safari optimization
 */

export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const vendor = window.navigator.vendor;
  
  // More accurate Safari detection
  return /Safari/.test(userAgent) && 
         /Apple Computer/.test(vendor) && 
         !/Chrome/.test(userAgent) && 
         !/Chromium/.test(userAgent);
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
};

export const getSafariVersion = (): number => {
  if (!isSafari()) return 0;
  
  const match = window.navigator.userAgent.match(/Version\/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const shouldUseSafariOptimizations = (): boolean => {
  return isSafari() || isIOS();
};