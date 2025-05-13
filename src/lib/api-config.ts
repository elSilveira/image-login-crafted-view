/**
 * API Configuration
 * 
 * This file provides configuration for API endpoints and helpers
 * to ensure consistent URL usage across the application.
 */

// Base URL for all API requests
export const API_BASE_URL = "http://localhost:3003/api";

/**
 * Helper function to get the full URL for an API endpoint
 * @param path The API path (without leading slash)
 * @returns The complete API URL
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Helper function to create query parameters
 * @param params Object containing query parameters
 * @returns URLSearchParams instance
 */
export function createQueryParams(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(params);
}

/**
 * Utility function to create a full API URL with query parameters
 * @param path API path
 * @param params Query parameters
 * @returns Full URL with query parameters
 */
export function createApiUrlWithParams(path: string, params: Record<string, string>): string {
  const url = getApiUrl(path);
  const searchParams = createQueryParams(params);
  return `${url}?${searchParams.toString()}`;
}

export default {
  getApiUrl,
  createQueryParams,
  createApiUrlWithParams,
  API_BASE_URL
};
