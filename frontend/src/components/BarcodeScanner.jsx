import React, { useState, useRef, useCallback } from 'react';
import { QrReader } from 'react-qr-barcode-scanner';
import { FiCamera, FiX, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front camera, 'environment' for back camera

  // Handle successful scan
  const handleScan = useCallback(async (result) => {
    if (result && result.text) {
      setScanResult(result.text);
      setIsScanning(false);
      setIsLoading(true);
      
      try {
        // Search for product by barcode
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/search/barcode/${result.text}`);
        
        if (response.ok) {
          const product = await response.json();
          toast.success('Product found!');
          onScanSuccess(product);
        } else {
          toast.error('Product not found with this barcode');
        }
      } catch (error) {
        console.error('Error searching product:', error);
        toast.error('Error searching for product');
      } finally {
        setIsLoading(false);
      }
    }
  }, [onScanSuccess]);

  // Handle scan errors
  const handleError = useCallback((error) => {
    console.error('Scanner error:', error);
    toast.error('Scanner error. Please try again.');
  }, []);

  // Toggle camera (front/back)
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Start scanning
  const startScanning = () => {
    setIsScanning(true);
    setScanResult('');
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiCamera className="mr-2" />
            Barcode Scanner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FiX />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="mb-4">
          {isScanning ? (
            <div className="relative">
              <div className="border-2 border-blue-500 rounded-lg overflow-hidden">
                <QrReader
                  constraints={{
                    facingMode: facingMode
                  }}
                  onResult={handleScan}
                  onError={handleError}
                  style={{
                    width: '100%',
                    height: '300px'
                  }}
                />
              </div>
              
              {/* Scanner Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-2 border-transparent relative">
                  {/* Corner indicators */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                  
                  {/* Center scanning line */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 animate-pulse"></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                  Point camera at barcode or QR code
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <FiCamera className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Ready to scan</p>
                <p className="text-sm text-gray-500">
                  Click start to begin scanning
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Scanned:</strong> {scanResult}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isScanning ? (
            <button
              onClick={startScanning}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FiCamera />
                  Start Scanning
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={stopScanning}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Stop
              </button>
              <button
                onClick={toggleCamera}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Flip Camera
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>• Point your camera at a barcode or QR code</p>
          <p>• Make sure the code is well-lit and in focus</p>
          <p>• The scanner will automatically detect and search for products</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;