import apiClient from "./api";
import type { Review } from "@/types";

export interface CreateReviewRequest {
  packageId: string;
  bookingId?: string; // Optional - review can be submitted without booking
  rating: number;
  comment: string;
}

// Get all reviews for a package
export const getPackageReviews = async (packageId: string): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(
    `/api/reviews/package/${packageId}`
  );
  return response.data;
};

// Get reviews by tourist
export const getReviewsByTourist = async (
  touristId: string
): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(
    `/api/reviews/tourist/${touristId}`
  );
  return response.data;
};

// Create review (Tourist only, after completing trip)
export const createReview = async (
  data: CreateReviewRequest
): Promise<Review> => {
  const response = await apiClient.post<Review>("/api/reviews", data);
  return response.data;
};

// Helper: Calculate average rating from reviews array (client-side)
export const calculatePackageRating = (
  reviews: Review[]
): { average: number; count: number } => {
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length
  };
};
