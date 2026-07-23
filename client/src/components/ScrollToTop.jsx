import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — sube la página suavemente al inicio en cada cambio de ruta.
 * Colócalo dentro del Router (en App.jsx) para que detecte cambios de pathname.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // En la primera carga no animamos (la página ya empieza arriba)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Animación fluida hacia el inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
