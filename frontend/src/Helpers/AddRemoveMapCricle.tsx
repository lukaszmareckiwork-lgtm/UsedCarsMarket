import { point } from "@turf/helpers";
import turfCircle from "@turf/circle";

// Example function to add a circle
export function addCircle(
  map: mapboxgl.Map,
  lng: number,
  lat: number,
  radiusKm: number,
  layerId: string
) {
  // Create a circle polygon using Turf.js
  const center = point([lng, lat]);
  const options = { steps: 64, units: "kilometers" as const };
  const circlePolygon = turfCircle(center, radiusKm, options);

  // If the layer exists, update it; otherwise, create a new source + layer
  if (map.getSource(layerId)) {
    (map.getSource(layerId) as mapboxgl.GeoJSONSource).setData(circlePolygon);
  } else {
    map.addSource(layerId, {
      type: "geojson",
      data: circlePolygon,
    });

    // Resolve CSS variable to concrete color string so Mapbox can use it.
    // Mapbox GL JS does not evaluate CSS variables, so we read the computed value.
    const computedPrimary = (typeof window !== "undefined" && window.getComputedStyle)
      ? window.getComputedStyle(document.documentElement).getPropertyValue("--colorsPrimary").trim()
      : "#0071CE";
    const primaryColor = computedPrimary || "#0071CE";

    map.addLayer({
      id: layerId,
      type: "fill",
      source: layerId,
      paint: {
        "fill-color": primaryColor,
        "fill-opacity": 0.2,
      },
    });

    map.addLayer({
      id: layerId + "-border",
      type: "line",
      source: layerId,
      paint: {
        "line-color": primaryColor,
        "line-width": 2,
      },
    });
  }
}

export function removeCircle(map: mapboxgl.Map, layerId: string) {
  // Remove border layer
  if (map.getLayer(layerId + "-border")) {
    map.removeLayer(layerId + "-border");
  }

  // Remove main fill layer
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }

  // Remove source
  if (map.getSource(layerId)) {
    map.removeSource(layerId);
  }
}
