import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export type RiskLevel = 0 | 1 | 2 | 3;

export interface RiskArea {
  pincode: number;
  latitude: number;
  longitude: number;
  risk_level: RiskLevel;
  risk_label: string;
  color: string;
  temperature: number;
  humidity: number;
  population: number;
  elderly_percent: number;
  literacy_rate?: number;
}

export interface RiskMapResponse {
  date: string;
  total_areas: number;
  risk_map: RiskArea[];
}

export interface ForecastItem {
  date: string;
  pincode: number;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  risk_level: RiskLevel;
  risk_label: string;
  color: string;
}

export interface ForecastResponse {
  forecast_days: number;
  total_predictions: number;
  forecast: ForecastItem[];
}

export interface PincodeHistory {
  date: string;
  temperature: number;
  humidity: number;
  risk_level: RiskLevel;
  risk_label: string;
}

export interface PincodeDetailsResponse {
  pincode: number;
  location: { latitude: number; longitude: number };
  demographics: {
    population: number;
    elderly_percent: number;
    literacy_rate: number;
  };
  current_risk: PincodeHistory;
  forecast: PincodeHistory[];
}

export interface StatisticsResponse {
  date: string;
  total_areas: number;
  risk_distribution: Record<string, number>;
  average_temperature: string;
  average_humidity: string;
  high_risk_areas: number;
  affected_population: number;
}

export interface HighRiskArea extends RiskArea {
  vulnerable_population: number;
}

export interface HighRiskAreasResponse {
  total_high_risk_areas: number;
  threshold: number;
  areas: HighRiskArea[];
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: any;
    try {
      error = await response.json();
    } catch {
      error = { error: "Unknown error" };
    }
    throw new ApiError(
      error.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      error
    );
  }
  return response.json();
}

export async function getRiskMap(): Promise<RiskMapResponse> {
  const response = await fetch(`${API_BASE_URL}/risk-map`);
  return handleResponse<RiskMapResponse>(response);
}

export async function getRiskForecast(
  days: number = 5
): Promise<ForecastResponse> {
  const response = await fetch(`${API_BASE_URL}/risk-forecast?days=${days}`);
  return handleResponse<ForecastResponse>(response);
}

export async function getPincodeDetails(
  pincode: number
): Promise<PincodeDetailsResponse> {
  const response = await fetch(`${API_BASE_URL}/pincode/${pincode}`);
  return handleResponse<PincodeDetailsResponse>(response);
}

export async function getStatistics(): Promise<StatisticsResponse> {
  const response = await fetch(`${API_BASE_URL}/statistics`);
  return handleResponse<StatisticsResponse>(response);
}

export async function getHighRiskAreas(
  threshold: number = 2
): Promise<HighRiskAreasResponse> {
  const response = await fetch(
    `${API_BASE_URL}/high-risk-areas?threshold=${threshold}`
  );
  return handleResponse<HighRiskAreasResponse>(response);
}

export function getRiskLabel(riskLevel: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    0: "Caution",
    1: "Extreme Caution",
    2: "Danger",
    3: "Extreme Danger",
  };
  return labels[riskLevel];
}

export function getRiskColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    0: "#4ade80",
    1: "#fbbf24",
    2: "#fb923c",
    3: "#ef4444",
  };
  return colors[riskLevel];
}

export function calculateVulnerablePopulation(
  population: number,
  elderlyPercent: number
): number {
  return Math.round((population * elderlyPercent) / 100);
}

export const formatTemperature = (temp: number | string): string =>
  `${Number(temp).toFixed(1)}°C`;

export const formatHumidity = (humidity: number | string): string =>
  `${Number(humidity).toFixed(0)}%`;

export const formatNumber = (num: number): string =>
  num >= 1_000_000
    ? `${(num / 1_000_000).toFixed(1)}M`
    : num >= 1_000
    ? `${(num / 1_000).toFixed(1)}K`
    : `${num}`;

export function useApiData<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, refetch: fetcher };
}
