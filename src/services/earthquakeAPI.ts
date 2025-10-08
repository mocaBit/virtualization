import type { EarthquakeResponse, EarthquakeFeature } from '../types/earthquake';
import { generateMockData } from '../utils/mockData';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export interface EarthquakeAPIParams {
  starttime?: string;
  endtime?: string;
  minmagnitude?: number;
  maxmagnitude?: number;
  limit?: number;
  offset?: number;
  orderby?: 'time' | 'magnitude';
}

export class EarthquakeAPI {
  private static mockDataCache: EarthquakeFeature[] = [];
  private static lastMockDataGeneration = 0;
  
  private static generateLargeMockDataset(): EarthquakeFeature[] {
    if (Date.now() - this.lastMockDataGeneration < 60000 && this.mockDataCache.length > 0) {
      return this.mockDataCache;
    }
    
    // Generate a large dataset for development
    const largeDataset = generateMockData(2000);
    this.mockDataCache = largeDataset.features as EarthquakeFeature[];
    this.lastMockDataGeneration = Date.now();
    
    return this.mockDataCache;
  }

  private static buildQueryString(params: EarthquakeAPIParams): string {
    const searchParams = new URLSearchParams({
      format: 'geojson',
      ...Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    });
    
    return searchParams.toString();
  }

  static async fetchEarthquakes(params: EarthquakeAPIParams = {}): Promise<EarthquakeResponse> {
    const defaultParams: EarthquakeAPIParams = {
      starttime: '2020-01-01',
      endtime: new Date().toISOString().split('T')[0],
      minmagnitude: 2.5,
      limit: 100,
      offset: 1,
      orderby: 'time',
      ...params
    };

    const queryString = this.buildQueryString(defaultParams);
    const url = `${USGS_BASE_URL}?${queryString}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
      }

      const data: EarthquakeResponse = await response.json();
      
      // Sort by time descending (most recent first)
      data.features.sort((a, b) => b.properties.time - a.properties.time);
      
      return data;
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      
      // Enhanced fallback with pagination simulation
      if (import.meta.env.DEV) {
        console.warn('Using mock data as fallback with pagination simulation');
        return this.getMockDataWithPagination(defaultParams);
      }
      
      throw error;
    }
  }

  private static getMockDataWithPagination(params: EarthquakeAPIParams): EarthquakeResponse {
    const allMockData = this.generateLargeMockDataset();
    
    // Apply filters
    const filteredData = allMockData.filter(eq => {
      const magnitude = eq.properties.mag;
      return magnitude >= (params.minmagnitude || 0);
    });
    
    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 100;
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return {
      type: "FeatureCollection",
      metadata: {
        generated: Date.now(),
        url: "mock-data-paginated",
        title: "Mock Earthquake Data with Pagination",
        status: 200,
        api: "mock",
        count: paginatedData.length
      },
      features: paginatedData
    };
  }

  static async fetchRecentEarthquakes(
    limit: number = 100,
    minMagnitude: number = 2.5,
    offset: number = 0
  ): Promise<EarthquakeFeature[]> {
    const params: EarthquakeAPIParams = {
      starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      minmagnitude: minMagnitude,
      limit,
      offset,
      orderby: 'time'
    };

    const response = await this.fetchEarthquakes(params);
    return response.features;
  }

  static async fetchEarthquakesByTimeRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<EarthquakeFeature[]> {
    const params: EarthquakeAPIParams = {
      starttime: startDate.toISOString().split('T')[0],
      endtime: endDate.toISOString().split('T')[0],
      limit,
      offset,
      orderby: 'time'
    };

    const response = await this.fetchEarthquakes(params);
    return response.features;
  }

  static getMagnitudeColor(magnitude: number): string {
    if (magnitude >= 7) return 'bg-red-600';
    if (magnitude >= 6) return 'bg-red-500';
    if (magnitude >= 5) return 'bg-orange-500';
    if (magnitude >= 4) return 'bg-yellow-500';
    if (magnitude >= 3) return 'bg-green-500';
    return 'bg-blue-500';
  }

  static getMagnitudeLabel(magnitude: number): string {
    if (magnitude >= 8) return 'Great';
    if (magnitude >= 7) return 'Major';
    if (magnitude >= 6) return 'Strong';
    if (magnitude >= 5) return 'Moderate';
    if (magnitude >= 4) return 'Light';
    if (magnitude >= 3) return 'Minor';
    return 'Micro';
  }
}
