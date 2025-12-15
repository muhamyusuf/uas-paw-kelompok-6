import apiClient from "./api";
import type { Destination } from "@/types";

export interface DestinationFilters {
  search?: string;
}

// Get all destinations with optional filters
export const getAllDestinations = async (filters?: DestinationFilters): Promise<Destination[]> => {
  const params: Record<string, string> = {};
  
  if (filters?.search) {
    params.q = filters.search;
  }

  const response = await apiClient.get<Destination[]>("/api/destinations", { params });
  return response.data;
};

// Get destination by ID
export const getDestinationById = async (id: string): Promise<Destination> => {
  const response = await apiClient.get<Destination>(`/api/destinations/${id}`);
  return response.data;
};

// Search destinations - uses main endpoint with query param
export const searchDestinations = async (
  query: string
): Promise<Destination[]> => {
  const response = await apiClient.get<Destination[]>("/api/destinations", {
    params: { q: query },
  });
  return response.data;
};

// Create destination (Admin only)
export const createDestination = async (
  data: FormData
): Promise<Destination> => {
  const response = await apiClient.post<Destination>("/api/destinations", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
