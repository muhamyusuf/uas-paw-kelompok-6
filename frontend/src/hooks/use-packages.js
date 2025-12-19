import { useCallback } from "react";
import { useFetch, useFetchById } from "./use-fetch";
import { useMutations } from "./use-mutation";
import {
  getAllPackages,
  getPackageById,
  getPackagesByAgent,
  createPackage,
  updatePackage,
  deletePackage,
} from "@/services/package.service";

/**
 * Hook untuk mengambil semua packages dengan filter
 */
export function usePackages(filters = {}) {
  // Stringify filters untuk stable dependency
  const filtersKey = JSON.stringify(filters);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- filtersKey is used as proxy for filters
  const fetchPackages = useCallback(() => getAllPackages(filters), [filtersKey]);

  const { data, isLoading, error, refetch } = useFetch(fetchPackages, {
    errorMessage: "Gagal mengambil data packages",
    initialData: [],
  });

  return { packages: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil package berdasarkan ID
 */
export function usePackage(id) {
  const { data, isLoading, error, refetch } = useFetchById(getPackageById, id, {
    errorMessage: "Gagal mengambil data package",
  });

  return { packageData: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil packages berdasarkan agent
 */
export function useAgentPackages(agentId) {
  const { data, isLoading, error, refetch } = useFetchById(getPackagesByAgent, agentId, {
    errorMessage: "Gagal mengambil data packages",
    initialData: [],
  });

  return { packages: data, isLoading, error, refetch };
}

/**
 * Hook untuk operasi mutasi package (create, update, delete)
 */
export function usePackageMutation() {
  const { create, update, remove, isLoading, error } = useMutations({
    create: {
      fn: createPackage,
      options: { errorMessage: "Gagal membuat package" },
    },
    update: {
      fn: (id, data) => updatePackage(id, data),
      options: { errorMessage: "Gagal mengupdate package" },
    },
    remove: {
      fn: deletePackage,
      options: { errorMessage: "Gagal menghapus package" },
    },
  });

  return { create, update, remove, isLoading, error };
}
