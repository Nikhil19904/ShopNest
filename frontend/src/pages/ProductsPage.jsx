import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import ProductFilters from '../components/ProductFilters';
import { FaSortAmountDown, FaThList, FaThLarge } from 'react-icons/fa';
import { fetchEnhancedProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const location = useLocation();

  // Fetch products using our enhanced fetching function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get category from URL if present
      const params = new URLSearchParams(location.search);
      const categoryParam = params.get('category');
      
      // Use our enhanced product fetching function
      const productData = await fetchEnhancedProducts({
        limit: 50, // Get more products for better filtering options
        category: categoryParam || '',
        enhanceImages: true // Enable high-quality images
      });
      
      if (productData && productData.length > 0) {
        setProducts(productData);
        setFilteredProducts(productData);
        
        // Find the maximum price for the price filter
        const maxProductPrice = Math.max(...productData.map(p => p.price));
        setMaxPrice(Math.ceil(maxProductPrice + 100)); // Add some buffer
      } else {
        toast.error('No products available');
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  // Apply filters - Wrapped in useCallback to prevent recreation on every render
  const applyFilters = useCallback((filterData, productsList = products) => {
    let filtered = [...productsList];
    
    // Apply search filter
    if (filterData.search) {
      const searchTerm = filterData.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchTerm) || 
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filters
    if (filterData.categories.length > 0) {
      filtered = filtered.filter(product => 
        filterData.categories.includes(product.category)
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filterData.priceRange.min && 
      product.price <= filterData.priceRange.max
    );
    
    // Apply rating filter
    if (filterData.rating > 0) {
      filtered = filtered.filter(product => 
        (product.rating?.rate || 0) >= filterData.rating
      );
    }
    
    // Apply color filter
    if (filterData.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors?.some(color => filterData.colors.includes(color))
      );
    }
    
    // Apply brand filter
    if (filterData.brands.length > 0) {
      filtered = filtered.filter(product => 
        filterData.brands.includes(product.brand)
      );
    }
    
    // Apply discount filter
    if (filterData.discount > 0) {
      filtered = filtered.filter(product => 
        (product.discount || 0) >= filterData.discount
      );
    }
    
    // Apply stock filter
    if (filterData.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    // Apply sorting
    if (filterData.sort !== 'default') {
      switch (filterData.sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'rating-desc':
          filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'discount-desc':
          filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        default:
          // Default sorting
          break;
      }
    }
    
    setFilteredProducts(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products]);

  // Apply filter from URL parameters
  const applyFilterFromUrl = useCallback((productsList) => {
    const params = new URLSearchParams(location.search);
    
    // Initialize filters from URL
    const filterData = {
      search: params.get('search') || '',
      priceRange: {
        min: params.has('minPrice') ? Number(params.get('minPrice')) : 0,
        max: params.has('maxPrice') ? Number(params.get('maxPrice')) : maxPrice
      },
      categories: params.has('categories') ? params.get('categories').split(',') : [],
      rating: params.has('rating') ? Number(params.get('rating')) : 0,
      sort: params.get('sort') || 'default',
      colors: params.has('colors') ? params.get('colors').split(',') : [],
      brands: params.has('brands') ? params.get('brands').split(',') : [],
      discount: params.has('discount') ? Number(params.get('discount')) : 0,
      inStock: params.has('inStock') ? params.get('inStock') === 'true' : false
    };
    
    // Apply the filters
    applyFilters(filterData, productsList);
  }, [location.search, maxPrice, applyFilters]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilteredProducts(products);
    setCurrentPage(1);
  }, [products]);
  
  // Re-apply filters when URL parameters change
  useEffect(() => {
    if (products.length > 0) {
      applyFilterFromUrl(products);
    }
  }, [location.search, products, applyFilterFromUrl]);
  
  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle products per page change
  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  if (loading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">No products available.</p>
      </div>
    );
  }

  return (
    <section className='min-h-screen w-full'>
      <div className="container p-5 mx-auto mt-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
          {/* Left sidebar - Filters */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ProductFilters 
              applyFilters={applyFilters} 
              resetFilters={resetFilters}
              maxPrice={maxPrice}
            />
          </div>
          
          {/* Right side - Products */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                Our Products
              </h1>
              
              {/* Products toolbar - count, view mode, sorting */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaSortAmountDown className="mr-2" />
                  <span>
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View mode toggle */}
                  <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setViewMode('grid')} 
                      className={`px-3 py-2 ${
                        viewMode === 'grid' 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label="Grid view"
                    >
                      <FaThLarge />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`px-3 py-2 ${
                        viewMode === 'list' 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label="List view"
                    >
                      <FaThList />
                    </button>
                  </div>
                  
                  {/* Products per page */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="per-page" className="text-sm text-gray-600 dark:text-gray-300">
                      Show:
                    </label>
                    <select 
                      id="per-page" 
                      value={productsPerPage} 
                      onChange={handleProductsPerPageChange}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                      <option value={48}>48</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid or List */}
              {filteredProducts.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {currentProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full py-20 text-center">
                  <p className="text-xl text-gray-600 dark:text-gray-300">No products match your filters.</p>
                  <button 
                    onClick={resetFilters}
                    className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => paginate(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      // Show limited page numbers with ellipsis for large ranges
                      if (
                        index === 0 || 
                        index === totalPages - 1 || 
                        (index >= currentPage - 2 && index <= currentPage + 2)
                      ) {
                        return (
                          <button 
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-1 border rounded-md ${
                              currentPage === index + 1
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      } else if (
                        (index === 1 && currentPage > 4) ||
                        (index === totalPages - 2 && currentPage < totalPages - 4)
                      ) {
                        return <span key={index} className="px-1 self-end">...</span>;
                      }
                      
                      return null;
                    })}
                    
                    <button 
                      onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage; 