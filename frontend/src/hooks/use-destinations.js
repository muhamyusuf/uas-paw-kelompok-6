import { useCallback } from "react";
import { useFetch, useFetchById } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
} from "@/services/destination.service";

/**
 * Hook untuk mengambil semua destinations
 */
export function useDestinations() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getAllDestinations(), []),
    { errorMessage: "Gagal mengambil data destinations", initialData: [] }
  );

  return { destinations: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil destination berdasarkan ID
 */
export function useDestination(id) {
  const { data, isLoading, error, refetch } = useFetchById(getDestinationById, id, {
    errorMessage: "Gagal mengambil data destination",
  });

  return { destination: data, isLoading, error, refetch };
}

/**
 * Hook untuk operasi mutasi destination (create)
 * Note: Update dan delete bisa ditambahkan ketika service mendukung
 */
export function useDestinationMutation() {
  const {
    mutate: create,
    isLoading,
    error,
  } = useMutation(createDestination, {
    errorMessage: "Gagal membuat destination",
  });

  return { create, isLoading, error };
}
