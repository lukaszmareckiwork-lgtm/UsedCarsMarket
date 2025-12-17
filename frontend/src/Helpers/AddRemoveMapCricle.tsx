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

    map.addLayer({
      id: layerId,
      type: "fill",
      source: layerId,
      paint: {
        "fill-color": "#0071CE",
        "fill-opacity": 0.2,
      },
    });

    map.addLayer({
      id: layerId + "-border",
      type: "line",
      source: layerId,
      paint: {
        "line-color": "#0071CE",
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
