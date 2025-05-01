import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext provides token management

// Determine the base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple token refresh attempts concurrently
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Add Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken'); // Use 'accessToken' key
    if (token && !config.headers.Authorization) { // Add token if not already present
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if the error is 401 (Unauthorized) and it's not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Prevent multiple refresh calls
      if (isRefreshing) {
        // If already refreshing, add the request to a queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers!['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err); // Propagate the error if refresh fails
        });
      }

      originalRequest._retry = true; // Mark as retry attempt
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error("No refresh token available, logging out.");
        // Trigger logout logic here (e.g., redirect to login, clear context)
        // This part depends on how logout is handled globally. 
        // For now, just reject the promise.
        isRefreshing = false;
        processQueue(error); // Reject queued requests
        // Potentially call logout function from AuthContext if accessible
        // window.location.href = '/login'; // Simple redirect
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          token: refreshToken,
        });

        const { accessToken: newAccessToken } = refreshResponse.data;
        
        // Update stored access token
        localStorage.setItem('accessToken', newAccessToken);
        
        console.log("Token refreshed successfully.");

        // Update the Authorization header for the original request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers!['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken); // Resolve queued requests with the new token

        // Retry the original request with the new token
        return apiClient(originalRequest);

      } catch (refreshError: any) {
        console.error("Failed to refresh token:", refreshError);
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Trigger logout logic here
        isRefreshing = false;
        processQueue(refreshError); // Reject queued requests with the refresh error
        // window.location.href = '/login'; // Simple redirect
        // Potentially call logout function from AuthContext
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For errors other than 401 or for retry attempts that failed
    return Promise.reject(error);
  }
);

// --- Existing API Functions (keep them as they are) ---

// Function to fetch user profile
export const fetchUserProfile = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

// Function to update user profile
export const updateUserProfile = async (userData: any) => {
  const { data } = await apiClient.put('/users/me', userData);
  return data;
};

// Function to fetch service details by ID
export const fetchServiceDetails = async (serviceId: string) => {
  const { data } = await apiClient.get(`/services/${serviceId}`);
  return data;
};

// Function to fetch company details by ID
export const fetchCompanyDetails = async (companyId: string) => {
  const { data } = await apiClient.get(`/companies/${companyId}`);
  return data;
};

// Function to fetch professional details by ID
export const fetchProfessionalDetails = async (professionalId: string) => {
  const { data } = await apiClient.get(`/professionals/${professionalId}`);
  return data;
};

// Function to fetch all categories
export const fetchCategories = async () => {
  const { data } = await apiClient.get("/categories");
  return data;
};

// Function to fetch user's appointments
export const fetchAppointments = async () => {
  const { data } = await apiClient.get("/appointments"); 
  return data;
};

// Add other API functions as needed

export default apiClient;




// Function to update professional profile
export const updateProfessionalProfile = async (professionalId: string, professionalData: any) => {
  const { data } = await apiClient.put(`/professionals/${professionalId}`, professionalData);
  return data;
};




// Function to register a new company
export const registerCompany = async (companyData: any) => {
  const { data } = await apiClient.post("/companies", companyData);
  return data;
};




// Function to fetch services by company ID
export const fetchCompanyServices = async (companyId: string) => {
  const { data } = await apiClient.get(`/services?companyId=${companyId}`);
  return data;
};

// Function to fetch appointments by company ID
export const fetchCompanyAppointments = async (companyId: string) => {
  // Assuming the backend supports filtering appointments by companyId
  const { data } = await apiClient.get(`/appointments?companyId=${companyId}`);
  return data;
};




// --- API Functions for Search/Exploration (Phase 3) ---

// Function to fetch services with filters
export const fetchServices = async (params: Record<string, any> = {}) => {
  // Convert params object to query string
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get(`/services?${queryString}`);
  return data; // Assuming backend returns an array of services
};

// Function to fetch companies with filters
export const fetchCompanies = async (params: Record<string, any> = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get(`/companies?${queryString}`);
  return data; // Assuming backend returns an array of companies
};

// Function to fetch professionals with filters
export const fetchProfessionals = async (params: Record<string, any> = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get(`/professionals?${queryString}`);
  return data; // Assuming backend returns an array of professionals
};




// --- API Functions for Booking (Phase 3) ---

// Function to fetch available time slots for a specific date and service/professional
export const fetchAvailability = async (params: {
  date: string; // YYYY-MM-DD format
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get(`/appointments/availability?${queryString}`);
  // Assuming backend returns an object like { availableSlots: ["09:00", "10:00", ...], disabledDates?: ["YYYY-MM-DD", ...] }
  return data;
};

// Function to create a new appointment
export const createAppointment = async (appointmentData: {
  serviceId: string;
  professionalId?: string;
  companyId?: string;
  userId: string; // Assuming userId is known or obtained from auth context
  startTime: string; // ISO 8601 format (e.g., "2024-07-25T09:00:00.000Z")
  // Add other necessary fields like endTime, notes, etc.
}) => {
  const { data } = await apiClient.post("/appointments", appointmentData);
  return data;
};

