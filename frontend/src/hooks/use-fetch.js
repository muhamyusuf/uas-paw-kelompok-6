import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic hook untuk data fetching dengan auto-fetch dan dependency tracking
 * @param {Function} fetchFn - Fungsi async yang mengembalikan data
 * @param {Object} options - Opsi konfigurasi
 * @param {boolean} options.enabled - Apakah auto-fetch diaktifkan (default: true)
 * @param {any} options.initialData - Data awal sebelum fetch
 * @param {Function} options.onSuccess - Callback saat fetch berhasil
 * @param {Function} options.onError - Callback saat fetch gagal
 * @param {string} options.errorMessage - Pesan error default
 * @param {Array} deps - Dependencies untuk refetch (selain enabled)
 * @returns {Object} { data, isLoading, error, refetch }
 */
export function useFetch(fetchFn, options = {}, deps = []) {
  const {
    enabled = true,
    initialData = null,
    onSuccess,
    onError,
    errorMessage = "Gagal mengambil data",
  } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState(null);

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMsg = err.message || errorMessage;
        setError(errorMsg);
        onError?.(err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, enabled, ...deps]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Variant of useFetch untuk fetch dengan parameter ID
 * @param {Function} fetchFn - Fungsi async yang menerima ID dan mengembalikan data
 * @param {string|number} id - ID untuk fetch
 * @param {Object} options - Opsi konfigurasi (sama dengan useFetch)
 * @returns {Object} { data, isLoading, error, refetch }
 */
export function useFetchById(fetchFn, id, options = {}) {
  const enabled = options.enabled !== false && !!id;

  return useFetch(
    useCallback(() => fetchFn(id), [fetchFn, id]),
    { ...options, enabled },
    [id]
  );
}
