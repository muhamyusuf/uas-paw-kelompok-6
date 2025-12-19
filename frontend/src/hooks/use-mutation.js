import { useState, useCallback } from "react";

/**
 * Generic hook untuk operasi mutasi (create, update, delete)
 * @param {Function} mutationFn - Fungsi async yang melakukan mutasi
 * @param {Object} options - Opsi konfigurasi
 * @param {Function} options.onSuccess - Callback saat mutasi berhasil
 * @param {Function} options.onError - Callback saat mutasi gagal
 * @param {string} options.errorMessage - Pesan error default
 * @returns {Object} { mutate, isLoading, error, reset }
 */
export function useMutation(mutationFn, options = {}) {
  const { onSuccess, onError, errorMessage = "Operasi gagal" } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(...args);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err.message || errorMessage;
        setError(errorMsg);
        onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, errorMessage]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { mutate, isLoading, error, reset };
}

/**
 * Factory function untuk membuat multiple mutations dalam satu hook
 * @param {Object} mutations - Object dengan key sebagai nama dan value sebagai fungsi mutasi
 * @param {Object} options - Opsi global untuk semua mutations
 * @returns {Object} Object dengan semua mutations + isLoading + error
 */
export function useMutations(mutations, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMutationHandler = useCallback(
    (mutationFn, mutationOptions = {}) => {
      const {
        errorMessage = options.errorMessage || "Operasi gagal",
        onSuccess,
        onError,
      } = mutationOptions;

      return async (...args) => {
        setIsLoading(true);
        setError(null);

        try {
          const result = await mutationFn(...args);
          onSuccess?.(result);
          options.onSuccess?.(result);
          return result;
        } catch (err) {
          const errorMsg = err.message || errorMessage;
          setError(errorMsg);
          onError?.(err);
          options.onError?.(err);
          throw err;
        } finally {
          setIsLoading(false);
        }
      };
    },
    [options]
  );

  // Build mutation handlers
  const mutationHandlers = {};
  Object.entries(mutations).forEach(([name, config]) => {
    if (typeof config === "function") {
      mutationHandlers[name] = createMutationHandler(config);
    } else {
      mutationHandlers[name] = createMutationHandler(config.fn, config.options);
    }
  });

  return { ...mutationHandlers, isLoading, error };
}
