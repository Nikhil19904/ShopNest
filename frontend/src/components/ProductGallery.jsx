import React, { useState, useEffect } from 'react';
import { IoMdColorPalette } from 'react-icons/io';
import { MdOutlineStraighten } from 'react-icons/md';

const ProductGallery = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

  // Update selected color and size when product changes
  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Sample color data (in a real app, this would come from the product data)
  const colors = product?.colors || [
    { name: 'Black', hex: '#000000', image: product?.image || product?.images?.[0] },
    { name: 'White', hex: '#FFFFFF', image: product?.image || product?.images?.[1] },
    { name: 'Red', hex: '#FF0000', image: product?.image || product?.images?.[2] },
    { name: 'Blue', hex: '#0000FF', image: product?.image || product?.images?.[3] },
  ];

  // Sample size data (in a real app, this would come from the product data)
  const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];

  // If no product provided, return a placeholder
  if (!product) {
    return (
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No product image available</p>
      </div>
    );
  }
  
  // Ensure we have image(s) to display
  const images = product.images || (product.image ? [product.image] : []);
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No product image available</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main image display */}
      <div className="relative mb-4">
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={images[activeImage]} 
            alt={product?.title} 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                activeImage === index ? 'border-[var(--primary)]' : 'border-transparent'
              }`}
            >
              <img src={image} alt={`${product.title} - view ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      
      {/* Color swatches */}
      {colors.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <IoMdColorPalette className="mr-2" />
            <h3 className="text-sm font-medium">Color: {selectedColor?.name}</h3>
          </div>
          <div className="flex space-x-2">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor?.name === color.name 
                    ? 'border-[var(--primary)]' 
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Size selection */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MdOutlineStraighten className="mr-2" />
              <h3 className="text-sm font-medium">Size: {selectedSize}</h3>
            </div>
          </div>
          <div className="flex space-x-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                  selectedSize === size 
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white' 
                    : 'border-gray-300 hover:border-[var(--primary)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery; 