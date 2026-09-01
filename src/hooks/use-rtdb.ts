
'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, onDisconnect, serverTimestamp, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { MachineState } from '@/lib/types/sensor';

export function useRTDB() {
  const [state, setState] = useState<MachineState>({
    system: null,
    current: null,
    sections: null,
    alerts: null,
    config: null,
    isConnected: false,
  });

  useEffect(() => {
    const refs = {
      system: ref(db, 'system'),
      current: ref(db, 'current'),
      sections: ref(db, 'sections'),
      alerts: ref(db, 'alerts'),
      config: ref(db, 'config'),
      connected: ref(db, '.info/connected'),
    };

    const unsubscribers = [
      onValue(refs.connected, (snap) => {
        setState(s => ({ ...s, isConnected: snap.val() }));
      }),
      onValue(refs.system, (snap) => {
        setState(s => ({ ...s, system: snap.val() }));
      }),
      onValue(refs.current, (snap) => {
        setState(s => ({ ...s, current: snap.val() }));
      }),
      onValue(refs.sections, (snap) => {
        setState(s => ({ ...s, sections: snap.val() }));
      }),
      onValue(refs.alerts, (snap) => {
        setState(s => ({ ...s, alerts: snap.val() }));
      }),
      onValue(refs.config, (snap) => {
        setState(s => ({ ...s, config: snap.val() }));
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  return state;
}
