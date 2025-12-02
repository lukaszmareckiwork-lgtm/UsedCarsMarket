import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { toast } from "react-toastify";
import "./LocationPicker.css";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  mapboxToken: string;
  targetCoordinates?: Coordinates; // these coordinates are used to center map/marker on that point and skip geolocation initially - use it to show location instead of searching for it
  onChange?: (lat: number, lng: number, placeName: string) => void;
  initialCoordinates?: Coordinates; // fallback if geolocation fails
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  mapboxToken,
  targetCoordinates: targetCoordinates,
  onChange,
  initialCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState<string>("");

  const defaultCoords = initialCoordinates ?? { lat: 42.746635, lng: -75.770045 };
  const isOnlyViewer = targetCoordinates !== undefined;

  useEffect(() => {
    if (!mapboxToken) {
      toast.warning("Mapbox token is missing! Map will not be displayed.");
      return;
    }

    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    //get initial position
    const getInitialPosition = (): Promise<Coordinates> =>
      new Promise((resolve) => {
        if (targetCoordinates) {
          resolve(targetCoordinates);
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(defaultCoords)
          );
        } else {
          resolve(defaultCoords);
        }
      });

    // create map and center on initial position
    getInitialPosition().then(async (coords) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coords.lng, coords.lat],
        zoom: 8,
      });

      mapRef.current = map;

      // Add a marker at initial location
      const marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(map);
      markerRef.current = marker;

      // create geocoder (search box) - skipping it when using target coordinates (just showing location on map)
      if(!isOnlyViewer){
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxToken,
          mapboxgl: mapboxgl as any,
          marker: true, // marker will also be created by geocoder when searching
          placeholder: "Search location",
          useBrowserFocus: true,
          language: navigator.language,
        });

        map.addControl(geocoder);

        geocoder.on("result", (e: any) => {
          const [lng, lat] = e.result.geometry.coordinates;
          const placeName = e.result.place_name || "";
          onChange?.(lat, lng, placeName);
          setAddress(placeName);

          // Move the marker to the selected location
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          }
        });
      }

      let placeName = "";

      // Reverse geocode initial position to show nearest town/village
      try {
        const userLang = navigator.language.split('-')[0]; // BCP 47 language code: "en", "fr", etc.

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?types=place&language=${userLang}&access_token=${mapboxToken}`
        );

        const data = await res.json();

        if (data?.features?.length > 0) {
          placeName = data.features[0].place_name;
          setAddress(placeName);
        } else {
          setAddress("");
        }

      } catch (err) {
        console.warn("Reverse geocoding failed:", err);
        setAddress("");
      }

      // Fire onChange for initial location
      // console.log(`LocationPicker - initial coords: ${coords.lat}, ${coords.lng} - address: ${placeName}`);
      onChange?.(coords.lat, coords.lng, placeName);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [mapboxToken]);

  return (
    <div className="location-picker-wrapper">
      {!isOnlyViewer && <label className="location-picker-label">Location</label>}
      <div ref={mapContainerRef} className="location-picker-map" />
      <div className="location-picker-address">
        <h1 className="location-picker-selected-location-label">{!isOnlyViewer ? "Selected location:" : "Location:"}</h1>
        <div className="location-picker-selected-location-value">
          {address || "No location selected"}
        </div>
      </div>
    </div>
  );
};