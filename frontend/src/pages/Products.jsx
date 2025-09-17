import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = ENDPOINTS.PRODUCTS.LIST;
        const queryParams = [];

        const searchQuery = searchParams.get('search');
        const categoryQuery = searchParams.get('category');

        if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
        if (categoryQuery && categoryQuery !== 'all') queryParams.push(`category=${encodeURIComponent(categoryQuery)}`);

        if (queryParams.length > 0) endpoint += `?${queryParams.join('&')}`;

        const data = await apiRequest('GET', endpoint);

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.message || 'Failed to fetch products');
          toast.error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong fetching products');
        toast.error('Something went wrong fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply frontend filters (price & rating)
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    if (filters.category !== 'all' && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.rating && (product.rating?.rate || 0) < parseFloat(filters.rating)) return false;
    return true;
  });

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
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="md:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 sticky top-24">
            <h3 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 text-indigo-700 dark:text-indigo-400">
              Refine Results
            </h3>

            {/* Category Filter */}
            <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Category</h4>
              <div className="space-y-2">
                {['all', 'electronics', 'jewelry', "men's clothing", "women's clothing", 'stationery', 'grocery'].map(cat => (
                  <div key={cat} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      id={`category-${cat}`}
                      value={cat}
                      checked={filters.category === cat}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`category-${cat}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Price</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
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

            {/* Rating Filter */}
            <div className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Customer Reviews</h4>
              <div className="space-y-2">
                {[4,3,2,1].map(stars => (
                  <div key={stars} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      id={`rating-${stars}`}
                      value={stars}
                      checked={filters.rating === stars.toString()}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor={`rating-${stars}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      {stars} & Up
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    id="rating-all"
                    value=""
                    checked={filters.rating === ""}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="rating-all" className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Ratings</label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ category: 'all', minPrice: '', maxPrice: '', rating: '' })}
              className="w-full py-2 px-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
