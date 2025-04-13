import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiRequest('PUT', ENDPOINTS.AUTH.UPDATE_PROFILE, formData);
      
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update user in Redux store
        dispatch({ type: 'auth/updateUser', payload: response.user });
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-2xl text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-800 dark:text-white">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-gray-800 dark:text-white">
                      {new Date(user.lastLogin || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Account Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    View Order History
                  </button>
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    View Wishlist
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 