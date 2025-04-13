import React, { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'
import { apiRequest } from '../utils/api'

const Register = () => {
  const initialData = {
    name:"",
    email:"",
    password:""
  }
  const [formData,setFormData] = useState(initialData)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required")
      return
    }
    
    // Password length validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }
    
    try{
      setLoading(true)
      
      // Use local server for development - this is a workaround for missing env vars
      const serverUrl = 'http://localhost:3000'
      console.log("Registering user at:", serverUrl)
      
      const data = await apiRequest(`${serverUrl}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(formData)
      });

      console.log("Registration response:", data)

      if(data.success){
        setFormData(initialData)
        toast.success(data.message || "Registration successful!")
        navigate("/login")
      } else {
        toast.error(data.message || "Registration failed. Please try again.")
      }
    } catch(error) {
      console.error("Registration error:", error)
      toast.error("Server connection error. Please check your backend server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient with animated shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us and start shopping
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                required
                autoComplete="off"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                required
                autoComplete="off"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 backdrop-blur-sm"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register