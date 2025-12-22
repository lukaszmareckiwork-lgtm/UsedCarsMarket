export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  PASSENGER_CARS_FAVOURITES: "/passenger-cars?OnlyFavourites=true",
  CREATED_BY: "/passenger-cars?createdBy=",
  CREATED_BY_BUILD: (id: string) => `/passenger-cars?createdBy=${id}` as const,

  HOME: "/",
  ADD_OFFER: "/add-offer",

  OFFER_DETAILS: "/offer/details/:id",
  OFFER_DETAILS_BUILD: (id: number) => `/offer/details/${id}` as const,

  PASSENGER_CARS: "/passenger-cars",
  // PASSENGER_CARS_WITH_QUERY: (query: string) => `/passenger-cars${query ? `?${query}` : ""}`,
} as const;