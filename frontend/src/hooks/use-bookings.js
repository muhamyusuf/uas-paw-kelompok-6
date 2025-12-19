import { useCallback } from "react";
import { useFetch, useFetchById } from "./use-fetch";
import { useMutations } from "./use-mutation";
import {
  getAllBookings,
  getBookingById,
  getBookingsByTourist,
  getBookingsByPackage,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getPendingPaymentBookings,
} from "@/services/booking.service";

/**
 * Hook untuk mengambil semua bookings (Admin/Agent)
 */
export function useBookings() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getAllBookings(), []),
    { errorMessage: "Gagal mengambil data bookings", initialData: [] }
  );

  return { bookings: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil booking berdasarkan ID
 */
export function useBooking(id) {
  const { data, isLoading, error, refetch } = useFetchById(getBookingById, id, {
    errorMessage: "Gagal mengambil data booking",
  });

  return { booking: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil bookings berdasarkan tourist
 */
export function useTouristBookings(touristId) {
  const { data, isLoading, error, refetch } = useFetchById(getBookingsByTourist, touristId, {
    errorMessage: "Gagal mengambil data bookings",
    initialData: [],
  });

  return { bookings: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil bookings berdasarkan package
 */
export function usePackageBookings(packageId) {
  const { data, isLoading, error, refetch } = useFetchById(getBookingsByPackage, packageId, {
    errorMessage: "Gagal mengambil data bookings",
    initialData: [],
  });

  return { bookings: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil pending payment bookings (Agent)
 */
export function usePendingPayments() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getPendingPaymentBookings(), []),
    { errorMessage: "Gagal mengambil data pending payments", initialData: [] }
  );

  return { bookings: data, isLoading, error, refetch };
}

/**
 * Hook untuk operasi mutasi booking (create, update status, cancel)
 */
export function useBookingMutation() {
  const { create, updateStatus, cancel, isLoading, error } = useMutations({
    create: {
      fn: createBooking,
      options: { errorMessage: "Gagal membuat booking" },
    },
    updateStatus: {
      fn: (id, status) => updateBookingStatus({ id, status }),
      options: { errorMessage: "Gagal mengupdate status booking" },
    },
    cancel: {
      fn: cancelBooking,
      options: { errorMessage: "Gagal membatalkan booking" },
    },
  });

  return { create, updateStatus, cancel, isLoading, error };
}
