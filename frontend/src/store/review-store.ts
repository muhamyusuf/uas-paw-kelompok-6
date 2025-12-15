import { create } from "zustand";
import type { Review } from "@/types";
import * as reviewService from "@/services/review.service";

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setReviews: (reviews: Review[]) => void;
  fetchReviewsByPackage: (packageId: string) => Promise<void>;
  fetchReviewsByTourist: (touristId: string) => Promise<void>;
  
  addReview: (review: Review) => void;
  createReview: (data: reviewService.CreateReviewRequest) => Promise<Review>;
  
  // Getters
  getReviewsByPackage: (packageId: string) => Review[];
  getReviewsByTourist: (touristId: string) => Review[];
  getPackageAverageRating: (packageId: string) => { average: number; count: number };
  hasUserReviewedPackage: (touristId: string, packageId: string) => boolean;
}

export const useReviewStore = create<ReviewState>()((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  setReviews: (reviews) => set({ reviews }),

  fetchReviewsByPackage: async (packageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await reviewService.getPackageReviews(packageId);
      // Merge with existing reviews (avoid duplicates)
      set((state) => {
        const existingIds = new Set(state.reviews.map(r => r.id));
        const newReviews = reviews.filter(r => !existingIds.has(r.id));
        return { 
          reviews: [...state.reviews, ...newReviews], 
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchReviewsByTourist: async (touristId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await reviewService.getReviewsByTourist(touristId);
      // Merge with existing reviews (avoid duplicates)
      set((state) => {
        const existingIds = new Set(state.reviews.map(r => r.id));
        const newReviews = reviews.filter(r => !existingIds.has(r.id));
        return { 
          reviews: [...state.reviews, ...newReviews], 
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
    })),

  createReview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const review = await reviewService.createReview(data);
      set((state) => ({ 
        reviews: [...state.reviews, review],
        isLoading: false 
      }));
      return review;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getReviewsByPackage: (packageId) => {
    return get().reviews.filter((review) => review.packageId === packageId);
  },

  getReviewsByTourist: (touristId) => {
    return get().reviews.filter((review) => review.touristId === touristId);
  },

  getPackageAverageRating: (packageId) => {
    const packageReviews = get().reviews.filter(
      (review) => review.packageId === packageId
    );
    return reviewService.calculatePackageRating(packageReviews);
  },

  hasUserReviewedPackage: (touristId, packageId) => {
    const reviews = get().reviews;
    return reviews.some(
      (review) => review.touristId === touristId && review.packageId === packageId
    );
  },
}));
