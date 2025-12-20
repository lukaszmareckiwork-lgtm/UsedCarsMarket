import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { OfferProps } from "../Data/OfferProps";
import type { OfferQueryObject } from "../Data/OfferQueryObject";
import { offerPreviewGetApi } from "../Services/OfferService";
import { clamp } from "./math";

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
  FuelTypes: null,
  TransmissionTypes: null,
  LocationLat: null,
  LocationLong: null,
  LocationRange: null,
  SortBy: null,
  SortDescending: undefined,
  PageNumber: 1,
  PageSize: 3,
};

// ------------------------------
// Parse Query helper function
// ------------------------------
function parseQueryFromSearchParams(
  searchParams: URLSearchParams
): OfferQueryObject {
  const q: OfferQueryObject = { ...DEFAULT_QUERY };

  searchParams.forEach((value, key) => {
    if (key === "MakeIds" || key === "ModelIds" || key === "FuelTypes" || key === "TransmissionTypes") {
      q[key] = searchParams.getAll(key).map(Number);
    } else if (key === "SortDescending") {
      q.SortDescending = value === "true" ? true : false;
    } else if (key === "OnlyFavourites") {
      q.OnlyFavourites = value === "true" ? true : undefined;
    } else if (!isNaN(Number(value))) {
      (q as any)[key] = Number(value);
    } else {
      (q as any)[key] = value;
    }
  });

  if (q.LocationRange != null) {
    q.LocationRange = clamp(q.LocationRange, 0, 500);
  }

  return q;
}

export function useOfferFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<OfferQueryObject>({...DEFAULT_QUERY});

  const [offers, setOffers] = useState<OfferProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);


  // ------------------------------
  // Convert URL → OfferQueryObject
  // ------------------------------
  useEffect(() => {
    const parsed = parseQueryFromSearchParams(searchParams);

    //Additional double-execution prevention- just in case
    if (JSON.stringify(parsed) !== JSON.stringify(query)) {
      setQuery(parsed);
    }
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
    setLoading(true);

    // Debounce: wait 500ms after last change
    const timer = setTimeout(() => {
        offerPreviewGetApi(query)
        ?.then((res) => {
            if (!res?.data) return;
            // console.log(
            //   "offerPreviewGetApi items:",
            //   JSON.stringify(res.data.items, null, 2)
            // );
            setOffers(res.data.items);
            setTotalCount(res.data.totalCount);
        })
        .finally(() => setLoading(false));
    }, 500); // adjust delay as needed

    console.log("Query changed:", query);

    // Cleanup if query changes before timeout
    return () => clearTimeout(timer);
    }, [query]);

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
