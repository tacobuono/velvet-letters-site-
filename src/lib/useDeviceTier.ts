import { useEffect, useState } from 'react';

export type DeviceTier = {
  isMobile: boolean;
  /** Max device pixel ratio for the Canvas. */
  dprMax: number;
};

function detect(): DeviceTier {
  if (typeof window === 'undefined') {
    return { isMobile: false, dprMax: 1.75 };
  }
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return {
    isMobile,
    dprMax: isMobile ? 1 : 1.75,
  };
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(detect);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => setTier(detect());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return tier;
}
