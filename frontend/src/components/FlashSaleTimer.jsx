import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTime, BiRightArrowAlt, BiX } from 'react-icons/bi';
import { FiGift, FiTruck } from 'react-icons/fi';

const FlashSaleTimer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(23, 59, 59);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime - now;

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      if (difference < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-40"
      >
        <BiTime className="text-xl animate-pulse" />
        Flash Sale
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            />

            {/* Modal Container - Adjusted for better positioning and scrolling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md mx-auto z-50 max-h-[90vh] overflow-y-auto rounded-[2.5rem]"
            >
              {/* Card Content */}
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>

                {/* Main Content */}
                <div className="relative bg-white/10 backdrop-blur-md p-8">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute right-6 top-6 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    <BiX className="text-2xl text-white" />
                  </motion.button>

                  {/* Sale Content */}
                  <div className="space-y-8 pt-4">
                    {/* Title Section */}
                    <div className="text-center space-y-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <BiTime className="text-4xl text-white" />
                      </motion.div>
                      <h3 className="text-4xl font-bold text-white">Flash Sale!</h3>
                      <p className="text-white/90 text-lg">Get up to 70% off on selected items</p>
                    </div>

                    {/* Timer Section */}
                    <div className="flex justify-center gap-3">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center w-[90px]">
                          <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                            <span className="text-4xl font-bold text-white block">
                              {String(value).padStart(2, '0')}
                            </span>
                            <p className="text-xs uppercase tracking-wider text-white/80">{unit}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 bg-white rounded-xl font-semibold text-violet-600 hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Shop Now</span>
                      <BiRightArrowAlt className="text-xl" />
                    </motion.button>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-xl p-3">
                        <FiGift className="text-xl" />
                        <span className="text-sm">Special Deals</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-xl p-3">
                        <FiTruck className="text-xl" />
                        <span className="text-sm">Free Shipping</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FlashSaleTimer;