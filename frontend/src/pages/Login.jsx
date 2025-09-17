import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with', loginMethod, formData, phoneNumber, otp);
    // Add your login logic here
  };

  const handleOtpChange = (value, index) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSendOTP = () => setShowOtpInput(true);

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    console.log('Verifying OTP:', otpString);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-white dark:bg-gray-800 text-yellow-600 shadow-md'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'bg-white dark:bg-gray-800 text-yellow-600 shadow-md'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            Phone Login
          </button>
        </div>

        {/* Social Login */}
        {loginMethod === 'email' && (
          <button className="w-full flex items-center justify-center gap-2 p-3 mb-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium">
            <FcGoogle size={24} />
            Continue with Google
          </button>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
              or {loginMethod === 'email' ? 'login with email' : 'login with phone'}
            </span>
          </div>
        </div>

        {/* Login Form */}
        {loginMethod === 'email' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
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
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-yellow-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-yellow-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </motion.button>
          </form>
        ) : (
          <div className="space-y-4">
            {!showOtpInput ? (
              <div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOTP}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  Send OTP
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300">Enter OTP sent to {phoneNumber}</p>
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
                      className="w-12 h-12 text-center text-lg rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyOTP}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  Verify OTP
                </motion.button>
                <button
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-sm text-yellow-500 hover:underline"
                >
                  Change Phone Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          New here?{' '}
          <Link to="/register" className="text-yellow-500 hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
