import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaChevronDown, FaChevronUp, FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
    const inrPrice = usdPrice * USD_TO_INR_RATE;
    return inrPrice.toFixed(2);
};

const ProductFilters = ({ applyFilters, resetFilters, maxPrice = 1000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    rating: true,
    sort: true,
    colors: false,
    brands: false,
    discount: false,
    availability: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update price range max when maxPrice changes
  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

  // Categories
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
    "stationery",
    "grocery"
  ];
  
  // Colors
  const colors = [
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#00FF00" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Orange", value: "#FFA500" },
    { name: "Gray", value: "#808080" }
  ];
  
  // Brands
  const brands = [
    "Apple",
    "Samsung",
    "Nike",
    "Adidas",
    "Sony",
    "Dell",
    "HP",
    "Xiaomi",
    "Zara",
    "H&M"
  ];

  // Discount options
  const discountOptions = [
    { value: 0, label: "All" },
    { value: 10, label: "10% & above" },
    { value: 20, label: "20% & above" },
    { value: 30, label: "30% & above" },
    { value: 40, label: "40% & above" },
    { value: 50, label: "50% & above" },
    { value: 60, label: "60% & above" },
    { value: 70, label: "70% & above" }
  ];

  // Sorting options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount-desc', label: 'Discount: High to Low' }
  ];

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Set initial filters based on URL params
    if (params.has('search')) {
      setSearchQuery(params.get('search'));
    }
    
    if (params.has('minPrice') && params.has('maxPrice')) {
      setPriceRange({
        min: Number(params.get('minPrice')),
        max: Number(params.get('maxPrice'))
      });
    }
    
    if (params.has('categories')) {
      setSelectedCategories(params.get('categories').split(','));
    }
    
    if (params.has('rating')) {
      setSelectedRating(Number(params.get('rating')));
    }
    
    if (params.has('sort')) {
      setSortBy(params.get('sort'));
    }
    
    if (params.has('colors')) {
      setSelectedColors(params.get('colors').split(','));
    }
    
    if (params.has('brands')) {
      setSelectedBrands(params.get('brands').split(','));
    }
    
    if (params.has('discount')) {
      setMinDiscount(Number(params.get('discount')));
    }
    
    if (params.has('inStock')) {
      setInStock(params.get('inStock') === 'true');
    }
  }, [location.search]);

  // Apply filters handler
  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      categories: selectedCategories,
      rating: selectedRating,
      sort: sortBy,
      search: searchQuery,
      colors: selectedColors,
      brands: selectedBrands,
      discount: minDiscount,
      inStock
    };
    
    // Update URL with filter params
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (priceRange.min > 0 || priceRange.max < maxPrice) {
      params.set('minPrice', priceRange.min);
      params.set('maxPrice', priceRange.max);
    }
    
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    
    if (selectedRating > 0) {
      params.set('rating', selectedRating);
    }
    
    if (sortBy !== 'default') {
      params.set('sort', sortBy);
    }
    
    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','));
    }
    
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','));
    }
    
    if (minDiscount > 0) {
      params.set('discount', minDiscount);
    }
    
    if (inStock) {
      params.set('inStock', inStock);
    }
    
    navigate({ search: params.toString() });
    applyFilters(filters);
    setIsOpen(false);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedCategories([]);
    setSelectedRating(0);
    setSortBy('default');
    setSearchQuery('');
    setSelectedColors([]);
    setSelectedBrands([]);
    setMinDiscount(0);
    setInStock(false);
    resetFilters();
    navigate({ search: '' });
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Toggle color selection
  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  // Toggle brand selection
  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    handleApplyFilters();
  };

  // Calculate active filter count
  const activeFilterCount = 
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) + 
    (selectedCategories.length > 0 ? 1 : 0) + 
    (selectedRating > 0 ? 1 : 0) + 
    (sortBy !== 'default' ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (selectedBrands.length > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStock ? 1 : 0);

  return (
    <div className="mb-8">
      {/* Mobile filter toggle button */}
      <div className="md:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-md rounded-lg"
        >
          <div className="flex items-center">
            <FaFilter className="text-[var(--primary)] mr-2" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Desktop & Mobile filters */}
      <div className={`${isOpen ? 'block' : 'hidden md:block'} mt-4 md:mt-0`}>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          {/* Search bar */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Search</h3>
            <form onSubmit={handleSearch} className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-4 py-2 focus:outline-none bg-white dark:bg-gray-700 dark:text-white border-0"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] flex-shrink-0"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('sort')}>
              <h3 className="text-lg font-medium">Sort By</h3>
              {expandedSections.sort ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.sort && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('price')}>
              <h3 className="text-lg font-medium">Price Range</h3>
              {expandedSections.price ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.price && (
              <>
                <div className="flex justify-between mb-2">
                  <span>₹{convertToINR(priceRange.min)}</span>
                  <span>₹{convertToINR(priceRange.max)}</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full accent-[var(--primary)]"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('categories')}>
              <h3 className="text-lg font-medium">Categories</h3>
              {expandedSections.categories ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.categories && (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-2 accent-[var(--primary)]"
                    />
                    <label htmlFor={`category-${category}`} className="capitalize">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('rating')}>
              <h3 className="text-lg font-medium">Rating</h3>
              {expandedSections.rating ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="mr-2 accent-[var(--primary)]"
                    />
                    <label htmlFor={`rating-${rating}`} className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                      <span className="ml-2">& up</span>
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-all"
                    checked={selectedRating === 0}
                    onChange={() => setSelectedRating(0)}
                    className="mr-2 accent-[var(--primary)]"
                  />
                  <label htmlFor="rating-all">All Ratings</label>
                </div>
              </div>
            )}
          </div>
          
          {/* Colors */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('colors')}>
              <h3 className="text-lg font-medium">Colors</h3>
              {expandedSections.colors ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.colors && (
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <div 
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`relative w-8 h-8 rounded-full cursor-pointer border ${
                      selectedColors.includes(color.name) 
                        ? 'ring-2 ring-[var(--primary)] ring-offset-2' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColors.includes(color.name) && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        {color.name === 'White' ? (
                          <FaCheck className="text-black" />
                        ) : (
                          <FaCheck className="text-white" />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Brands */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('brands')}>
              <h3 className="text-lg font-medium">Brands</h3>
              {expandedSections.brands ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.brands && (
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="mr-2 accent-[var(--primary)]"
                    />
                    <label htmlFor={`brand-${brand}`}>
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Discount */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('discount')}>
              <h3 className="text-lg font-medium">Discount</h3>
              {expandedSections.discount ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.discount && (
              <div className="space-y-2">
                {discountOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`discount-${option.value}`}
                      checked={minDiscount === option.value}
                      onChange={() => setMinDiscount(option.value)}
                      className="mr-2 accent-[var(--primary)]"
                    />
                    <label htmlFor={`discount-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Availability */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2" onClick={() => toggleSection('availability')}>
              <h3 className="text-lg font-medium">Availability</h3>
              {expandedSections.availability ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
            </div>
            {expandedSections.availability && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in-stock"
                  checked={inStock}
                  onChange={() => setInStock(!inStock)}
                  className="mr-2 accent-[var(--primary)]"
                />
                <label htmlFor="in-stock">In Stock Only</label>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {(priceRange.min > 0 || priceRange.max < maxPrice) && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">Price: ₹{convertToINR(priceRange.min)} - ₹{convertToINR(priceRange.max)}</span>
                    <button onClick={() => setPriceRange({ min: 0, max: maxPrice })}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                )}
                
                {selectedCategories.map((category) => (
                  <div key={category} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2 capitalize">{category}</span>
                    <button onClick={() => toggleCategory(category)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
                
                {selectedRating > 0 && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">Rating: {selectedRating}+</span>
                    <button onClick={() => setSelectedRating(0)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                )}
                
                {sortBy !== 'default' && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">
                      {sortOptions.find(option => option.value === sortBy)?.label}
                    </span>
                    <button onClick={() => setSortBy('default')}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                )}
                
                {selectedColors.map((color) => (
                  <div key={color} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">{color}</span>
                    <button onClick={() => toggleColor(color)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
                
                {selectedBrands.map((brand) => (
                  <div key={brand} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">{brand}</span>
                    <button onClick={() => toggleBrand(brand)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
                
                {minDiscount > 0 && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">Discount: {minDiscount}%+</span>
                    <button onClick={() => setMinDiscount(0)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                )}
                
                {inStock && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="mr-2">In Stock Only</span>
                    <button onClick={() => setInStock(false)}>
                      <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)]"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 