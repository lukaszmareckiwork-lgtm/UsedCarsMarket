import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { OfferProps } from "../Data/OfferProps";
import type { OfferQueryObject } from "../Data/OfferQueryObject";
import { offerPreviewGetApi } from "../Services/OfferService";

const DEFAULT_QUERY: OfferQueryObject = {
  OnlyFavourites: undefined,
  CreatedBy: null,
  MakeIds: null,
  ModelIds: null,
  Search: null,
  MinPrice: null,
  MaxPrice: null,
  MinYear: null,
  MaxYear: null,
  MinMileage: null,
  MaxMileage: null,
  FuelType: null,
  TransmissionType: null,
  LocationLat: null,
  LocationLong: null,
  LocationRange: null,
  SortBy: null,
  SortDescending: undefined,
  PageNumber: 1,
  PageSize: 3,
};

export function useOfferFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<OfferQueryObject>({ ...DEFAULT_QUERY });
  const [isInitialized, setIsInitialized] = useState(false);

  const [offers, setOffers] = useState<OfferProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // Convert URL → OfferQueryObject
  // ------------------------------
  useEffect(() => {
    const newQuery: typeof query = { ...DEFAULT_QUERY };

    searchParams.forEach((value, key) => {
      if (key === "MakeIds" || key === "ModelIds") {
        newQuery[key] = searchParams.getAll(key).map(Number);
      } else if (key === "SortDescending") {
        newQuery.SortDescending = value === "true" ? true : undefined;
      } else if (key === "OnlyFavourites") {
        newQuery.OnlyFavourites = value === "true" ? true : undefined;
      } else if (!isNaN(Number(value))) {
        (newQuery as any)[key] = Number(value);
      } else {
        (newQuery as any)[key] = value;
      }
    });

    setQuery(newQuery);
    setIsInitialized(true);
  }, [searchParams]);

  // ------------------------------
  // Sync OfferQueryObject → URL
  // ------------------------------
  const syncToUrl = (q: typeof query) => {
    const params = new URLSearchParams();

    Object.entries(q).forEach(([key, value]) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (typeof value === "boolean") {
        if (value) params.set(key, "true");
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  // ------------------------------
  // Call API whenever query changes (after initialization)
  // ------------------------------
  useEffect(() => {
    if (!isInitialized) return;

    setLoading(true);

    // Debounce: wait 500ms after last change
    const timer = setTimeout(() => {
        offerPreviewGetApi(query)
        ?.then((res) => {
            if (!res?.data) return;
            setOffers(res.data.items);
            setTotalCount(res.data.totalCount);
        })
        .finally(() => setLoading(false));
    }, 500); // adjust delay as needed

    // Cleanup if query changes before timeout
    return () => clearTimeout(timer);
    }, [query, isInitialized]);

  // ------------------------------
  // Public API for components
  // ------------------------------
  const updateFilters = (updates: Partial<typeof query>) => {
    const newQuery = { ...query, ...updates, PageNumber: 1 };
    setQuery(newQuery);
    syncToUrl(newQuery);
  };

  const toggleFavouriteFilter = () => {
    const newQuery = { ...query, OnlyFavourites: !query.OnlyFavourites };
    setQuery(newQuery);
    syncToUrl(newQuery);
  };

  const toggleSortDescending = () => {
    const newQuery = { ...query, SortDescending: !query.SortDescending };
    setQuery(newQuery);
    syncToUrl(newQuery);
  };

  const onPageChange = (page: number) => {
    const newQuery = { ...query, PageNumber: page };
    setQuery(newQuery);
    syncToUrl(newQuery);
  };

  return {
    query,
    offers,
    loading,
    totalCount,
    updateFilters,
    toggleFavouriteFilter,
    toggleSortDescending,
    onPageChange,
    setQuery,
  };
}
