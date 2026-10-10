import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Digifello` : 'Digifello — AI Tools & Software Engineering';
  }, [title]);
}
