import apiClient from "./api";
import type { Booking } from "@/types";

export interface CreateBookingRequest {
  packageId: string;
  travelDate: string;
  travelersCount: number;
  totalPrice: number;
}

export interface UpdateBookingStatusRequest {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

// Get all bookings (Admin/Agent) - Note: API returns {data: [...]}
export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<{ data: Booking[] }>("/api/bookings");
  return response.data.data;
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`/api/bookings/${id}`);
  return response.data;
};

// Get bookings by tourist
export const getBookingsByTourist = async (
  touristId: string
): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(
    `/api/bookings/tourist/${touristId}`
  );
  return response.data;
};

// Get bookings by package
export const getBookingsByPackage = async (
  packageId: string
): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(
    `/api/bookings/package/${packageId}`
  );
  return response.data;
};

// Create booking (Tourist only)
export const createBooking = async (
  data: CreateBookingRequest
): Promise<Booking> => {
  const response = await apiClient.post<Booking>("/api/bookings", data);
  return response.data;
};

// Update booking status (Agent only) - uses PUT method
export const updateBookingStatus = async (
  data: UpdateBookingStatusRequest
): Promise<Booking> => {
  const { id, status } = data;
  const response = await apiClient.put<Booking>(`/api/bookings/${id}/status`, {
    status,
  });
  return response.data;
};

// Cancel booking (Tourist can cancel their own) - uses PUT method
export const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await apiClient.put<Booking>(`/api/bookings/${id}/status`, {
    status: "cancelled",
  });
  return response.data;
};

// Get pending payment bookings (Agent only)
export const getPendingPaymentBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>("/api/bookings/payment/pending");
  return response.data;
};

