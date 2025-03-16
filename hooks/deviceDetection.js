// utils/deviceDetection.js
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const useDeviceDetection = () => {
  const [isClient, setIsClient] = useState(false); // Track if it's client-side
  const isDesktop = useMediaQuery({ minWidth: 1000 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1000 });
  const isMobileOnly = useMediaQuery({ maxWidth: 767 });

  // Use effect to set client-side state
  useEffect(() => {
    setIsClient(true); // Set to true after component mounts
  }, []);

  return {
    isDesktop: isClient ? isDesktop : false,
    isMobileOnly: isClient ? isMobileOnly : false,
    isTablet: isClient ? isTablet : false,
  };
};
