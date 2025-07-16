// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { loginSuccess, clearError } from '../redux/slices/authSlice'
// import { apiRequest } from '../utils/api'
// import { ENDPOINTS } from '../config/api'
// import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
// import toast from 'react-hot-toast'

// const Login = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   })
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
  
//   // Redux and routing hooks
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       navigate('/')
//     }
//   }, [user, navigate])

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {}
    
//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address'
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value
//     })
    
//     // Clear error when user types
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: undefined
//       })
//     }
//   }

//   // Toggle password visibility
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword)
//   }

//   // Form submission handler
//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     // Validate form before submission
//     if (!validateForm()) {
//       return
//     }
    
//       setLoading(true)
//     dispatch(clearError())

//     try {
//       // Make API request with proper error handling
//       const response = await apiRequest('POST', ENDPOINTS.AUTH.LOGIN, formData)

//       if (response.success) {
//         // Store token in localStorage
//         localStorage.setItem('token', response.token)
        
//         // Update Redux state
//         dispatch(loginSuccess({
//           user: response.user,
//           token: response.token
//         }))
        
//         toast.success('Login successful!')
//         navigate('/')
//       } else {
//         toast.error(response.message || 'Invalid credentials')
//       }
//     } catch (error) {
//       console.error('Login error:', error)
//       toast.error(error.message || 'Server error. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
//       <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Sign in to your account to continue shopping
//           </p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-5">
//             {/* Email Field */}
//             <div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaUser className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                   id="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email address"
//                   className={`block w-full pl-10 pr-3 py-3 border ${
//                     errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                   } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>
            
//             {/* Password Field with Show/Hide */}
//             <div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaLock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                   type={showPassword ? "text" : "password"}
//                 name="password"
//                   id="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                   className={`block w-full pl-10 pr-12 py-3 border ${
//                     errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                   } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
//                 />
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   <button
//                     type="button"
//                     onClick={toggleShowPassword}
//                     className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
//                   >
//                     {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
//                   </button>
//                 </div>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>
//           </div>

//           {/* Remember me / Forgot password */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <button 
//                 type="button"
//                 onClick={() => navigate('/forgot-password')}
//                 className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
//               >
//                 Forgot password?
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center">
//                 <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
//                 Signing in...
//               </div>
//             ) : (
//               'Sign in'
//             )}
//           </button>
//           </form>

//         {/* Divider */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           {/* Social Login Buttons */}
//           <div className="mt-6 grid grid-cols-2 gap-3">
//             <button
//               type="button"
//               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//             >
//               <span className="sr-only">Sign in with Google</span>
//               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.203-2.701-6.735-2.701-5.539 0-10.032 4.493-10.032 10.032s4.493 10.032 10.032 10.032c8.458 0 10.458-7.822 9.645-11.732h-9.645z" />
//               </svg>
//             </button>

//             <button
//               type="button"
//               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//             >
//               <span className="sr-only">Sign in with Facebook</span>
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.644c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686 0.235 2.686 0.235v2.953h-1.514c-1.491 0-1.956 0.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385c5.737-0.9 10.125-5.864 10.125-11.854z" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Register link */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Don't have an account?{' '}
//             <Link
//               to="/register"
//               className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
//             >
//               Sign up now
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  const handleOtpChange = (value, index) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSendOTP = async () => {
    // Implement your OTP sending logic here
    setShowOtpInput(true);
  };

  const handleVerifyOTP = async () => {
    // Implement your OTP verification logic here
    const otpString = otp.join('');
    console.log('Verifying OTP:', otpString);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">
            {/* Login Method Toggle */}
            <div className="flex rounded-lg overflow-hidden mb-8 bg-gray-100 dark:bg-gray-700 p-1">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Email Login
              </button>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Phone Login
              </button>
            </div>

            {loginMethod === 'email' ? (
              <div>
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Login to your account
                  </p>
                </div>

                {/* Social Login */}
                <button className="w-full flex items-center justify-center gap-2 p-3 mb-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <FcGoogle size={20} />
                  <span className="text-gray-600 dark:text-gray-300">Continue with Google</span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800">or login with email</span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                  >
                    Sign In
                  </motion.button>
                </form>

                {/* Register Link */}
                <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {!showOtpInput ? (
                  // Phone Input
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSendOTP}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg"
                    >
                      Send OTP
                    </motion.button>
                  </div>
                ) : (
                  // OTP Input
                  <div className="space-y-4">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Enter OTP
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        OTP sent to {phoneNumber}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          className="w-12 h-12 text-center text-lg font-semibold rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      ))}
                    </div>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleVerifyOTP}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg"
                      >
                        Verify OTP
                      </motion.button>
                      <button
                        onClick={() => setShowOtpInput(false)}
                        className="w-full text-sm text-blue-500 hover:text-blue-600"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
