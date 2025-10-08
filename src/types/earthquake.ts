export interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  url: string;
  detail: string;
  felt?: number;
  cdi?: number;
  mmi?: number;
  alert?: string;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst?: number;
  dmin?: number;
  rms?: number;
  gap?: number;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: "Point";
  coordinates: [number, number, number]; // [longitude, latitude, depth]
}

export interface EarthquakeFeature {
  type: "Feature";
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeResponse {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface VirtualScrollOptions {
  itemHeight: number;
  itemCount: number;
  viewportHeight: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
}
