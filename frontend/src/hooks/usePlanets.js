/**
 * usePlanets — fetches planet data from the API and stores it in Zustand.
 * Returns loading / error state for UI feedback.
 */

import { useEffect } from 'react';
import useStore from '../store/useStore';
import { fetchPlanets } from '../utils/api';

export function usePlanets() {
  const setPlanets = useStore((s) => s.setPlanets);
  const setPlanetsLoading = useStore((s) => s.setPlanetsLoading);
  const setPlanetsError = useStore((s) => s.setPlanetsError);
  const loading = useStore((s) => s.planetsLoading);
  const error = useStore((s) => s.planetsError);
  const planets = useStore((s) => s.planets);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPlanetsLoading(true);
      setPlanetsError(null);
      try {
        const response = await fetchPlanets();
        if (!cancelled) {
          setPlanets(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('⚠️ Could not fetch planets from API — using fallback data.', err.message);
          setPlanetsError(err.message);
        }
      } finally {
        if (!cancelled) setPlanetsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { planets, loading, error };
}
