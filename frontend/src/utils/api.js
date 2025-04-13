import { API_BASE_URL } from '../config/api';

/**
 * Enhanced utility function for API calls that handles authentication and errors
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data (optional)
 * @returns {Promise} - Response data
 */
export const apiRequest = async (method, endpoint, data = null) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Validate endpoint to avoid undefined errors
    if (!endpoint) {
        console.error('API Request Error: Endpoint is undefined');
        return {
            success: false,
            message: 'Invalid endpoint',
            error: 'INVALID_ENDPOINT'
        };
    }
    
    // Handle common endpoints that might not be available in development
    if (endpoint.includes('/cart') || endpoint.includes('/orders')) {
        // In development mode, provide mock responses for cart and order endpoints
        if (process.env.NODE_ENV === 'development') {
            console.log(`Mocking API endpoint ${endpoint} in development mode`);
            // Return mock success for certain operations
            if (method === 'GET') {
                return {
                    success: true,
                    data: endpoint.includes('/cart') ? { items: [] } : []
                };
            }
            return {
                success: true,
                message: 'Operation simulated in development mode'
            };
        }
    }
    
    // Prepare headers with authentication if token exists
    const headers = {
      'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    // Configure the request
    const config = {
        method,
        headers,
        credentials: 'include', // This enables sending cookies
    };
    
    // Add body for non-GET requests with data
    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }

    try {
        // Make the fetch request
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle 404 responses early
        if (response.status === 404) {
            return {
                success: false,
                message: 'Resource not found',
                statusCode: 404
            };
        }
        
        // Parse the JSON response
        let responseData;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            // Return a standardized error if JSON parsing fails
            return {
                success: false,
                message: 'Invalid response format from server',
                statusCode: response.status,
                error: 'INVALID_FORMAT'
            };
        }

        // Handle error responses
    if (!response.ok) {
            // Handle specific status codes
            if (response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            
            // Return standardized error response
            return {
                success: false,
                message: responseData.message || `Error: ${response.status}`,
                statusCode: response.status,
                error: responseData.error || 'API_ERROR'
            };
        }

        // Return standard success response if no data is returned
        if (!responseData) {
            return {
                success: true,
                message: 'Operation completed successfully'
            };
        }

        // Return the data directly if it's already structured as a response
        if (responseData.hasOwnProperty('success')) {
            return responseData;
        }

        // Wrap the data in a standard response format
        return {
            success: true,
            data: responseData
        };
    } catch (error) {
        console.error('API Request Error:', error);
        // Return standardized error for network/fetch errors
        return {
            success: false,
            message: error.message || 'Network error occurred',
            error: 'NETWORK_ERROR'
        };
    }
};

/**
 * Fetches products with enhanced image support from multiple sources
 * Combines local/remote API data with quality images from external APIs
 * @param {object} options - Configuration options
 * @param {number} options.limit - Maximum number of products to fetch
 * @param {string} options.category - Category filter
 * @param {boolean} options.featured - Whether to fetch featured products only
 * @returns {Promise<Array>} - Enhanced product data
 */
export const fetchEnhancedProducts = async (options = {}) => {
    try {
        // Default options
        const {
            limit = 12,
            category = '',
            featured = false
        } = options;
        
        // Build endpoint with query parameters
        let endpoint = `/products?limit=${limit}`;
        if (category) {
            endpoint += `&category=${encodeURIComponent(category)}`;
        }
        if (featured) {
            endpoint += '&featured=true';
        }
        
        // Fetch products from main API
        const response = await apiRequest('GET', endpoint);
        let products = response.products || [];
        
        // If no products or we need to enhance with external images
        if (products.length === 0 || options.enhanceImages) {
            // Fetch products from FakeStore API as backup or for enhancement
            const fakeStoreResponse = await fetch(`https://fakestoreapi.com/products${category ? `/category/${category}` : ''}`);
            const fakeStoreProducts = await fakeStoreResponse.json();
            
            // Enhance products with better images
            products = products.length === 0 ? fakeStoreProducts : products;
            
            // Additional high-quality images APIs
            const unsplashAccessKey = 'your-unsplash-access-key'; // Replace with your actual key
            const pexelsApiKey = 'your-pexels-api-key'; // Replace with your actual key
            
            // Function to fetch alternative images
            const fetchAlternativeImages = async (product) => {
                const searchTerm = encodeURIComponent(
                    product.category || product.title.split(' ')[0]
                );
                
                try {
                    // Try Unsplash API first (higher quality)
                    const unsplashResponse = await fetch(
                        `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=3`,
                        { headers: { Authorization: `Client-ID ${unsplashAccessKey}` } }
                    );
                    
                    if (unsplashResponse.ok) {
                        const unsplashData = await unsplashResponse.json();
                        if (unsplashData.results && unsplashData.results.length > 0) {
                            return unsplashData.results.map(result => result.urls.regular);
                        }
                    }
                    
                    // Fallback to Pexels API
                    const pexelsResponse = await fetch(
                        `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=3`,
                        { headers: { Authorization: pexelsApiKey } }
                    );
                    
                    if (pexelsResponse.ok) {
                        const pexelsData = await pexelsResponse.json();
                        if (pexelsData.photos && pexelsData.photos.length > 0) {
                            return pexelsData.photos.map(photo => photo.src.medium);
                        }
                    }
  } catch (error) {
                    console.error('Error fetching alternative images:', error);
                }
                
                // Return default image if all else fails
                return [product.image];
            };
            
            // Enhance products with multi-image support, discounts, etc.
            products = await Promise.all(
                products.map(async (product) => {
                    // Only fetch alternative images if enhanceImages option is true
                    const images = options.enhanceImages 
                        ? await fetchAlternativeImages(product)
                        : [product.image];
                    
                    // Add random discount to some products (for demo)
                    const hasDiscount = Math.random() > 0.5;
                    const discount = hasDiscount ? Math.floor(Math.random() * 50) + 10 : 0;
                    
                    // Random stock status (for demo)
                    const inStock = Math.random() > 0.2;
                    
                    // Random colors based on category
                    let colors = [];
                    if (product.category?.includes('clothing')) {
                        colors = ['Red', 'Blue', 'Black', 'White', 'Green']
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.floor(Math.random() * 3) + 1);
                    } else if (product.category?.includes('electronics')) {
                        colors = ['Black', 'Silver', 'Gray', 'White']
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.floor(Math.random() * 3) + 1);
                    } else {
                        colors = ['Black', 'White', 'Blue']
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.floor(Math.random() * 2) + 1);
                    }
                    
                    // Generate realistic brand based on category
                    let brand;
                    if (product.category?.includes('electronics')) {
                        brand = ['Apple', 'Samsung', 'Sony', 'Dell', 'LG'][Math.floor(Math.random() * 5)];
                    } else if (product.category?.includes('clothing')) {
                        brand = ['Nike', 'Adidas', 'Zara', 'H&M', 'Levis'][Math.floor(Math.random() * 5)];
                    } else if (product.category?.includes('jewelery')) {
                        brand = ['Tiffany', 'Cartier', 'Pandora', 'Swarovski', 'Kay'][Math.floor(Math.random() * 5)];
    } else {
                        brand = ['Amazon Basics', 'Generic', 'Premium', 'Luxe', 'Standard'][Math.floor(Math.random() * 5)];
                    }
                    
                    return {
                        ...product,
                        images: images.filter(Boolean), // Remove any null values
                        discount,
                        inStock,
                        colors,
                        brand
                    };
                })
            );
        }
        
        // Apply limit if required
        if (limit && products.length > limit) {
            products = products.slice(0, limit);
        }
        
        return products;
    } catch (error) {
        console.error('Error fetching enhanced products:', error);
    throw error;
  }
};

// Helper methods for common HTTP requests
export const get = (endpoint) => apiRequest('GET', endpoint);
export const post = (endpoint, data) => apiRequest('POST', endpoint, data);
export const put = (endpoint, data) => apiRequest('PUT', endpoint, data);
export const del = (endpoint) => apiRequest('DELETE', endpoint);

// Create a named object for the default export
const api = {
    get,
    post,
    put,
    delete: del,
    request: apiRequest,
    fetchEnhancedProducts
};

export default api; 