import { create } from "zustand";
import type { Destination, Package } from "@/types";
import * as destinationService from "@/services/destination.service";
import * as packageService from "@/services/package.service";

interface DestinationStore {
  destinations: Destination[];
  packages: Package[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDestinations: (destinations: Destination[]) => void;
  setPackages: (packages: Package[]) => void;
  
  fetchDestinations: () => Promise<void>;
  fetchPackages: (filters?: packageService.PackageFilters) => Promise<void>;
  fetchPackagesByAgent: (agentId: string) => Promise<void>;
  
  addPackage: (pkg: Package) => void;
  createPackage: (data: packageService.CreatePackageRequest) => Promise<Package>;
  updatePackage: (id: string, updates: packageService.UpdatePackageRequest) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  
  // Getters
  getPackagesByDestination: (destinationId: string) => Package[];
  getDestinationById: (id: string) => Destination | undefined;
  getPackageById: (id: string) => Package | undefined;
}

export const useDestinationStore = create<DestinationStore>((set, get) => ({
  destinations: [],
  packages: [],
  isLoading: false,
  error: null,

  setDestinations: (destinations) => set({ destinations }),
  setPackages: (packages) => set({ packages }),

  fetchDestinations: async () => {
    set({ isLoading: true, error: null });
    try {
      const destinations = await destinationService.getAllDestinations();
      set({ destinations, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchPackages: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const packages = await packageService.getAllPackages(filters);
      set({ packages, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchPackagesByAgent: async (agentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const packages = await packageService.getPackagesByAgent(agentId);
      set({ packages, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addPackage: (pkg) => set((state) => ({ 
    packages: [...state.packages, pkg] 
  })),

  createPackage: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPackage = await packageService.createPackage(data);
      set((state) => ({ 
        packages: [...state.packages, newPackage],
        isLoading: false 
      }));
      return newPackage;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updatePackage: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPackage = await packageService.updatePackage(id, updates);
      set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg.id === id ? updatedPackage : pkg
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deletePackage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await packageService.deletePackage(id);
      set((state) => ({
        packages: state.packages.filter((pkg) => pkg.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getPackagesByDestination: (destinationId) =>
    get().packages.filter((pkg) => pkg.destinationId === destinationId),

  getDestinationById: (id) =>
    get().destinations.find((dest) => dest.id === id),

  getPackageById: (id) => 
    get().packages.find((pkg) => pkg.id === id),
}));
