import { useEffect, useState } from 'react';

export type DeviceTier = {
  isMobile: boolean;
  /** Particle count for the persistent gold-dust system. */
  particleCount: number;
  /** Max device pixel ratio for the Canvas. */
  dprMax: number;
};

function detect(): DeviceTier {
  if (typeof window === 'undefined') {
    return { isMobile: false, particleCount: 600, dprMax: 1.75 };
  }
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  // Coarse low-power heuristic: few logical cores often signals a weaker GPU.
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const weak = isMobile || lowCores;

  return {
    isMobile,
    particleCount: weak ? 200 : 600,
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
