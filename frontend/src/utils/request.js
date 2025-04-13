import { toast } from 'react-toastify';

// Hardcoded API URL since environment variables aren't loading properly
const API_BASE_URL = 'http://localhost:3000';

/**
 * Utility function for API calls that handles authentication errors
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise} - Response from the API
 */
export const request = async (url, options = {}) => {
  // Ensure URL is absolute
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // Default options for fetch
  const defaultOptions = {
    credentials: 'include', // Always include credentials for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(fullUrl, { ...defaultOptions, ...options });
    
    // Handle network errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      
      // For token or authentication errors, redirect to login
      if (
        (errorData.message === 'Token missing.' || 
        errorData.message === 'Unauthorized.' ||
        response.status === 401) &&
        !window.location.pathname.includes('/login') &&
        !(url.includes('/api/auth/login') || url.includes('/api/auth/register'))
      ) {
        if (!sessionStorage.getItem('redirect_in_progress')) {
          sessionStorage.setItem('redirect_in_progress', 'true');
          toast.error('Session expired. Please log in again.');
          
          setTimeout(() => {
            sessionStorage.removeItem('redirect_in_progress');
            window.location.href = '/login';
          }, 1500);
        }
      }
      
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      toast.error('Unable to connect to the server. Please check if the server is running.');
    } else {
      console.error('API Error:', error);
    }
    throw error;
  }
};

export default request; 