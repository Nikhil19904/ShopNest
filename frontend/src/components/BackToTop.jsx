import React, { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // Make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="back-to-top">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-5 bottom-5 z-40 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Back to top"
        >
          <FaChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default BackToTop; 