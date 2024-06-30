import { useState, useEffect } from 'react';

const useGoogleMaps = (apiKey) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      setIsLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  return isLoaded;
};

export default useGoogleMaps;
