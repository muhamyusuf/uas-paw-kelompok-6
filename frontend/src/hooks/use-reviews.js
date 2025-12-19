import { useFetchById } from "./use-fetch";
import { useMutation } from "./use-mutation";
import { getPackageReviews, getReviewsByTourist, createReview } from "@/services/review.service";

/**
 * Hook untuk mengambil reviews berdasarkan package
 */
export function usePackageReviews(packageId) {
  const { data, isLoading, error, refetch } = useFetchById(getPackageReviews, packageId, {
    errorMessage: "Gagal mengambil data reviews",
    initialData: [],
  });

  return { reviews: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil reviews berdasarkan tourist
 */
export function useTouristReviews(touristId) {
  const { data, isLoading, error, refetch } = useFetchById(getReviewsByTourist, touristId, {
    errorMessage: "Gagal mengambil data reviews",
    initialData: [],
  });

  return { reviews: data, isLoading, error, refetch };
}

/**
 * Hook untuk operasi mutasi review (create)
 */
export function useReviewMutation() {
  const {
    mutate: create,
    isLoading,
    error,
  } = useMutation(createReview, {
    errorMessage: "Gagal membuat review",
  });

  return { create, isLoading, error };
}
