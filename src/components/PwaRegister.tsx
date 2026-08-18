'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('AuraFinance Service Worker registrado com sucesso:', reg.scope);
          })
          .catch((err) => {
            console.log('Falha ao registrar Service Worker:', err);
          });
      });
    }
  }, []);

  return null;
}
