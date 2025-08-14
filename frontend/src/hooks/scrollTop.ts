// src/hooks/scrollTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  console.log('ScrollToTop triggered for:', pathname);

  useEffect(() => {
    // Small timeout ensures it's called after route change
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [pathname]);

  return null;
}
