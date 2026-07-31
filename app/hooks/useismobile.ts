'use client';

import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 1024;

function getMediaQuery() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

function subscribe(callback: () => void) {
  const mql = getMediaQuery();
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot() {
  return getMediaQuery().matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
