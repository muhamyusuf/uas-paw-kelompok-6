import { create } from "zustand";
import type { Booking } from "@/types";
import * as bookingService from "@/services/booking.service";
import * as paymentService from "@/services/payment.service";

interface BookingStore {
  bookings: Booking[];
  pendingPayments: Booking[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBookings: (bookings: Booking[]) => void;
  fetchBookings: () => Promise<void>;
  fetchBookingsByTourist: (touristId: string) => Promise<void>;
  fetchBookingsByPackage: (packageId: string) => Promise<void>;
  fetchPendingPayments: () => Promise<void>;
  
  addBooking: (booking: Booking) => void;
  createBooking: (data: bookingService.CreateBookingRequest) => Promise<Booking>;
  
  updateBookingStatus: (
    id: string,
    status: "pending" | "confirmed" | "cancelled" | "completed"
  ) => Promise<void>;
  
  markBookingAsReviewed: (id: string) => void;
  
  uploadPaymentProof: (id: string, file: File) => Promise<void>;
  verifyPayment: (id: string) => Promise<void>;
  rejectPayment: (id: string, reason: string) => Promise<void>;
  
  // Getters
  getCompletedBookingsWithoutReview: (touristId: string) => Booking[];
  getBookingsByTourist: (touristId: string) => Booking[];
  getBookingsByPackage: (packageId: string) => Booking[];
  getPendingPaymentVerifications: () => Booking[];
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  pendingPayments: [],
  isLoading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingService.getAllBookings();
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchBookingsByTourist: async (touristId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingService.getBookingsByTourist(touristId);
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchBookingsByPackage: async (packageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingService.getBookingsByPackage(packageId);
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchPendingPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const pendingPayments = await paymentService.getPendingPayments();
      // Convert to Booking type if needed
      set({ 
        pendingPayments: pendingPayments as unknown as Booking[], 
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),

  createBooking: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.createBooking(data);
      set((state) => ({ 
        bookings: [...state.bookings, booking],
        isLoading: false 
      }));
      return booking;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateBookingStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await bookingService.updateBookingStatus({ id, status });
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
                completedAt: status === "completed" ? new Date().toISOString() : booking.completedAt,
              }
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  markBookingAsReviewed: (id) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, hasReviewed: true } : booking
      ),
    })),

  uploadPaymentProof: async (id, file) => {
    set({ isLoading: true, error: null });
    try {
      const result = await paymentService.uploadPaymentProof(id, file);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                paymentProofUrl: result.paymentProofUrl,
                paymentStatus: result.paymentStatus as Booking["paymentStatus"],
                paymentProofUploadedAt: new Date().toISOString(),
              }
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  verifyPayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await paymentService.verifyPayment(id);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                paymentStatus: "verified" as const,
                paymentVerifiedAt: new Date().toISOString(),
                status: "confirmed" as const,
                paymentRejectionReason: undefined,
              }
            : booking
        ),
        pendingPayments: state.pendingPayments.filter(p => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  rejectPayment: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      await paymentService.rejectPayment(id, reason);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                paymentStatus: "rejected" as const,
                paymentRejectionReason: reason,
              }
            : booking
        ),
        pendingPayments: state.pendingPayments.filter(p => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getCompletedBookingsWithoutReview: (touristId) => {
    const state = get();
    return state.bookings.filter(
      (booking) =>
        booking.touristId === touristId && 
        booking.status === "completed" && 
        !booking.hasReviewed
    );
  },

  getBookingsByTourist: (touristId) =>
    get().bookings.filter((booking) => booking.touristId === touristId),

  getBookingsByPackage: (packageId) =>
    get().bookings.filter((booking) => booking.packageId === packageId),

  getPendingPaymentVerifications: () =>
    get().bookings.filter((booking) => booking.paymentStatus === "pending_verification"),
}));
