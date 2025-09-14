declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  interface HeatmapOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    gradient?: { [key: number]: string };
  }

  function heatLayer(
    latlngs: [number, number, number][],
    options?: HeatmapOptions
  ): L.Layer;

  export default heatLayer;
}