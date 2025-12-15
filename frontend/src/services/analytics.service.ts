import apiClient from "./api";

// Agent Statistics Response (matches backend exactly)
export interface AgentStats {
    totalPackages: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageRating: number;
    pendingPaymentVerifications: number;
}

// Package Performance
export interface PackagePerformance {
    packageId: string;
    packageName: string;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    reviewsCount: number;
}

// Tourist Statistics (matches backend exactly)
export interface TouristStats {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    reviewsGiven: number;
    wishlistCount: number;
}

// Get agent statistics
export const getAgentStats = async (): Promise<AgentStats> => {
    const response = await apiClient.get<AgentStats>("/api/analytics/agent/stats");
    return response.data;
};

// Get package performance for agent
export const getPackagePerformance = async (): Promise<PackagePerformance[]> => {
    const response = await apiClient.get<PackagePerformance[]>(
        "/api/analytics/agent/package-performance"
    );
    return response.data;
};

// Get tourist statistics
export const getTouristStats = async (): Promise<TouristStats> => {
    const response = await apiClient.get<TouristStats>("/api/analytics/tourist/stats");
    return response.data;
};
