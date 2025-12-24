import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./LocationPicker.css";
import { addCircle, removeCircle } from "../../Helpers/AddRemoveMapCricle";
import { RangeControl } from "../RangeControl/RangeControl";
import { getPlaceName } from '../../Services/MapboxService'
import { PiLineVertical } from "react-icons/pi";

export const LocationPickerModeEnum = {
  OnlyShow: 0,
  PickDirect: 1,
  PickRange: 2,
} as const;
export type LocationPickerModeEnum = number;

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  mode: LocationPickerModeEnum;
  targetCoordinates?: Coordinates; // these coordinates are used to center map/marker on that point and skip geolocation initially - use it to show location instead of searching for it
  onChange?: (lat: number, lng: number, placeName: string, range?: number) => void;
  onRangeChange?: (range: number) => void;
  initialCoordinates?: Coordinates; // fallback if geolocation fails
  targetRange?: number;
}

//react-select > geocoder double click problem solution
function useBlurGeocoderConflictSolver() {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.classList.contains("mapboxgl-ctrl-geocoder--input")) {
        const active = document.activeElement as HTMLElement | null;
        if (active && active !== target && active.tagName === "INPUT") {
          active.blur();
          target.focus(); // <-- force geocoder to receive focus immediately
          // console.log("BLURED other input and focused geocoder:", active);
        } else {
          // console.log("Clicked geocoder input:", target);
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, []);
}

async function assignPlaceName(
  coords: Coordinates,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  addressRef: React.RefObject<string>
) {
  const placeName:string = await getPlaceName(coords.lng, coords.lat);
  setAddress(placeName);
  addressRef.current = placeName;

  return placeName;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  mode,
  targetCoordinates: targetCoordinates,
  onChange,
  onRangeChange,
  initialCoordinates,
  targetRange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [address, setAddress] = useState<string>("");
  const addressRef = useRef<string>(address);
  
  const [range, setRange] = useState<number>(5);
  const rangeRef = useRef<number>(range);

  const defaultCoords = initialCoordinates ?? { lat: 42.746635, lng: -75.770045 };
  const initWithoutLocation = mode === LocationPickerModeEnum.PickRange && targetCoordinates === undefined;

  useEffect(() => {
    const initialRange = targetRange ?? 5;
    setRange(initialRange);
    rangeRef.current = initialRange;
  }, [targetRange]);

  useEffect(() => {
    if (!targetCoordinates) {
      clearResult();
    }
  }, [targetCoordinates]);

  const clearResult = () =>{
    setAddress("");
    markerRef.current?.remove();
    markerRef.current = null;
    if(mapRef.current) removeCircle(mapRef.current, "my-circle");
  }

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

  const onControlRangeChange = (value: number) => {
    setRange(value);
    rangeRef.current = value;
    onRangeChange?.(value);

    if (mapRef.current && markerRef.current) {
      const { lng, lat } = markerRef.current.getLngLat();
      onChange?.(lat, lng, addressRef.current, rangeRef.current);
    }

    addCircleAndFlyTo(value);
  }

  function getZoomForRadius(radiusInKilometers: number): number {
    var radiusInMeters = radiusInKilometers * 1000;
    // Prevent log of zero or negative
    if (radiusInMeters <= 0) return 16;
    return Math.max(0, 16 - Math.log2(radiusInMeters / 100));
  }

  function addCircleAndFlyTo(range: number) {
    if (mapRef.current && markerRef.current) {
      const { lng, lat } = markerRef.current.getLngLat();

      addCircle(mapRef.current, lng, lat, range, "my-circle");

      const zoom = getZoomForRadius(range);
      // Fly to marker with zoom
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        speed: 1,       // animation speed (1 is default)
        curve: 1.4,       // animation curve
        essential: true,  // ensures it runs even if user has reduced motion enabled
      });
    }
  }

  //react-select > geocoder double click problem solution
  useBlurGeocoderConflictSolver();

  const getInitialPosition = (): Promise<Coordinates | undefined> => new Promise((resolve) => {
    if (targetCoordinates) {
      resolve(targetCoordinates);
    } 
    else if (initWithoutLocation) {
      resolve(undefined);
    } 
    else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(defaultCoords)
      );
    } 
    else {
      resolve(defaultCoords);
    }
  });

  const setMarkerPosition = (coords: Coordinates, map: Map) => {
    markerRef.current?.remove();
    markerRef.current = null;

    if(markerRef.current === null){
      const marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(map);
      markerRef.current = marker;
    }
  }

  //init map
  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const initializeMap = async () => {
      const coords = await getInitialPosition();

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: 0,
        language: navigator.language,
      });

      mapRef.current = map;

      map.on("load", async () => {
        if (mode !== LocationPickerModeEnum.OnlyShow) {
          const geocoder = createGeocoder();
          map.addControl(geocoder);

          if (mode === LocationPickerModeEnum.PickRange) {
            const rangeControl = new RangeControl(onControlRangeChange);
            map.addControl(rangeControl, "top-right");
            rangeControl.setValue(targetRange ?? 5);
          }
        }

        if(!coords) return;

        setMarkerPosition(coords, map);

        if(mode !== LocationPickerModeEnum.PickRange)
        {
          map.setCenter([coords.lng, coords.lat]);
          map.setZoom(8);
        }

        const placeName = await assignPlaceName(coords, setAddress, addressRef);
        onChange?.(coords.lat, coords.lng, placeName, rangeRef.current);
        
        if (mode === LocationPickerModeEnum.PickRange) 
          addCircleAndFlyTo(rangeRef.current);

        function createGeocoder() {
          const geocoder = new MapboxGeocoder({
            accessToken: mapboxToken,
            mapboxgl: mapboxgl as any,
            marker: false,
            placeholder: "Search location",
            useBrowserFocus: true,
            language: navigator.language,
            flyTo: mode !== LocationPickerModeEnum.PickRange
          });

          geocoder.on("result", (e: any) => {
            const [lng, lat] = e.result.geometry.coordinates;
            const placeName = e.result.place_name || "";
            onChange?.(lat, lng, placeName, rangeRef.current);
            setAddress(placeName);
            addressRef.current = placeName;

            setMarkerPosition({ lat, lng }, map);

            if (mode === LocationPickerModeEnum.PickRange) 
            {
              addCircleAndFlyTo(rangeRef.current);
            }
          });
          return geocoder;
        }

      });
    };

    initializeMap();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [mapboxToken]);

  return (
    <div className="location-picker-wrapper">
      {mode == LocationPickerModeEnum.PickDirect && <label className="location-picker-label">Location</label>}
      <div ref={mapContainerRef} className="location-picker-map" />

      <div className="location-picker-address">
        <div className="location-picker-address-left">
          <h1 className="location-picker-selected-location-label">{mode !== LocationPickerModeEnum.OnlyShow ? "Selected location:" : "Location:"}</h1>
          <div className="location-picker-selected-location-value">
            {address || "No location selected"}
          </div>
        </div>
        <div className="location-picker-address-right">
          {address && targetRange && <PiLineVertical size={32} color={"var(--colorsPlaceholder)"} />}
          {address && targetRange&& <span className="location-picker-address-right-range">{`+${targetRange}km`}</span>}
        </div>
      </div>
    </div>
  );
};