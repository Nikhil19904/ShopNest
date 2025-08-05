import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BarcodeScanner from '../components/BarcodeScanner';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import { FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const searchQuery = searchParams.get('search');
        const categoryQuery = searchParams.get('category');
        
        let endpoint = ENDPOINTS.PRODUCTS.LIST;
        const queryParams = [];
        
        if (searchQuery) {
          queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
        } else if (categoryQuery && categoryQuery !== 'all') {
          queryParams.push(`category=${encodeURIComponent(categoryQuery)}`);
        }
        
        if (queryParams.length > 0) {
          endpoint += `?${queryParams.join('&')}`;
        }

        const data = await apiRequest('GET', endpoint);
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || 'Failed to fetch products');
          toast.error(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError('Something went wrong fetching products');
        toast.error('Something went wrong fetching products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    if (filters.category !== 'all' && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.rating && product.rating.rate < parseFloat(filters.rating)) return false;
    return true;
  });

  // Handle barcode scan success
  const handleScanSuccess = (product) => {
    setShowScanner(false);
    // Navigate to product detail page
    navigate(`/product/${product._id}`);
    toast.success(`Found: ${product.title}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Now on Left Side with Amazon-like design */}
          <div className="md:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 sticky top-24">
              <h3 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 text-indigo-700 dark:text-indigo-400">
                Refine Results
              </h3>
              
              {/* Category Filter */}
              <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Department</h4>
                <div className="space-y-2">
                  {['all', 'electronics', 'jewelry', "men's clothing", "women's clothing", 'stationery', 'grocery'].map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                      />
                      <label 
                        htmlFor={`category-${category}`} 
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Price</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                {/* Quick price ranges */}
                <div className="mt-3 space-y-2">
                  <button 
                    onClick={() => {
                      setFilters(prev => ({...prev, minPrice: '', maxPrice: '50'}));
                    }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline w-full text-left"
                  >
                    Under $50
                  </button>
                  <button 
                    onClick={() => {
                      setFilters(prev => ({...prev, minPrice: '50', maxPrice: '100'}));
                    }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline w-full text-left"
                  >
                    $50 to $100
                  </button>
                  <button 
                    onClick={() => {
                      setFilters(prev => ({...prev, minPrice: '100', maxPrice: ''}));
                    }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline w-full text-left"
                  >
                    $100 & Above
                  </button>
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Customer Reviews</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${stars}`}
                        name="rating"
                        value={stars}
                        checked={filters.rating === stars.toString()}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                      />
                      <label 
                        htmlFor={`rating-${stars}`} 
                        className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {Array(stars).fill(0).map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-all"
                      name="rating"
                      value=""
                      checked={filters.rating === ""}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                    />
                    <label 
                      htmlFor="rating-all" 
                      className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      All Ratings
                    </label>
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    category: 'all',
                    minPrice: '',
                    maxPrice: '',
                    rating: ''
                  });
                }}
                className="w-full py-2 px-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid - Takes remaining width */}
          <div className="md:w-3/4">
            {/* Products Header with Scanner Button */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Products
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {filteredProducts.length} products found
                  </p>
                </div>
                <button
                  onClick={() => setShowScanner(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiCamera className="text-lg" />
                  Scan Barcode
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.filter(product => product && product.id).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Products;