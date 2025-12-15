/**
 * Booking Utilities
 * Shared functions untuk booking status display
 */

import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Booking status type
 */
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

/**
 * Get icon component for booking status
 */
export const getBookingStatusIcon = (status: string): ReactNode => {
  switch (status) {
    case "confirmed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

/**
 * Get color classes for booking status badge
 */
export const getBookingStatusColor = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "completed":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    case "pending":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
};

/**
 * Get human-readable label for booking status
 */
export const getBookingStatusLabel = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

/**
 * Check if booking can be cancelled by user
 */
export const canCancelBooking = (status: string, travelDate: Date): boolean => {
  if (status !== "confirmed" && status !== "pending") {
    return false;
  }
  
  // Can't cancel if travel date is in the past
  const now = new Date();
  return travelDate > now;
};

/**
 * Check if booking can be confirmed by agent
 */
export const canConfirmBooking = (status: string): boolean => {
  return status === "pending";
};

/**
 * Get all available booking statuses
 */
export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];
