'use client';
import { useEffect } from 'react';
import { registerProximityGlow } from '@/lib/useProximityGlow';

export function ProximityInit() {
  useEffect(() => {
    registerProximityGlow();
  }, []);
  return null;
}
