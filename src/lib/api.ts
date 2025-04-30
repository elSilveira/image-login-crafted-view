import axios from 'axios';

// Determine the base URL for the API
// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage or auth context
    // This is a placeholder - adjust based on how the token is actually stored
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch user profile
export const fetchUserProfile = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

// Function to update user profile
export const updateUserProfile = async (userData: any) => {
  // Only send fields that are being updated
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

// Function to fetch user's appointments (assuming backend filters by logged-in user)
export const fetchAppointments = async () => {
  // The auth interceptor should add the necessary token
  const { data } = await apiClient.get("/appointments"); 
  return data;
};


// Add other API functions as needed (e.g., fetchServices, fetchCompanies, etc.)

export default apiClient;

