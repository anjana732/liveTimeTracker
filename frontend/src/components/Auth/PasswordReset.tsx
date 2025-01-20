
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

interface PasswordResetProps {
    email: String
  }
  

export function PasswordReset() {


  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] =useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const passwordCriteria = [
    { label: 'At least 8 characters', test: (password: string) => password.length >= 8 },
    { label: 'At least one uppercase letter', test: (password: string) => /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', test: (password: string) => /[a-z]/.test(password) },
    { label: 'At least one number', test: (password: string) => /[0-9]/.test(password) },
    { label: 'At least one special character (!@#$%^&*)', test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const isPasswordValid = passwordCriteria.every((criterion) => criterion.test(newPassword));
  const isPasswordMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email Received", email);
    try {
        const response = await fetch('/server/time_tracker_function/admin/resetPassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: email,
            password 
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
  
        navigate('/AdminLogin'); 
        // onBackToLogin(); 
      } catch (error) {
        console.error('Signup error:', error);
        // setError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
      } finally {
        //  setIsLoading(false);
      }
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="logo"
            className="mx-auto w-32"
          />
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            We are The Fristine Team
          </h2>
        </div>
        <p className="text-gray-600 text-center mt-4">Reset your password</p>
        <form onSubmit={handleSubmit}  className="mt-6 space-y-4">
          {/* New Password Field */}
          <div className="relative">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="new-password"
              placeholder="Enter new password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => {setNewPassword(e.target.value)
                setPassword(e.target.value)
              }}
              required
            />
            <span
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer mt-3"
            >
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              id="confirm-password"
              placeholder="Confirm new password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
            <div className="mt-1 text-sm">
              {confirmPassword && (
                <span
                  className={`font-medium ${
                    isPasswordMatch ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {isPasswordMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </span>
              )}
            </div>
          </div>

          {/* Password Criteria */}
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600">Password must include:</p>
            <ul className="mt-1 space-y-1">
              {passwordCriteria.map((criterion, index) => (
                <li key={index} className="flex items-center">
                  <span
                    className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-white ${
                      criterion.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {criterion.test(newPassword) ? '✓' : ''}
                  </span>
                  <span
                    className={`text-sm ${
                      criterion.test(newPassword) ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {criterion.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${
                isPasswordValid && isPasswordMatch
                  ? 'bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 focus:ring-orange-400'
                  : 'bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 focus:ring-orange-400 cursor-not-allowed'
              }`}
              disabled={!isPasswordValid || !isPasswordMatch}
            >
              Reset Password
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-sm font-medium text-gray-500 hover:underline"
          >
            Login Page
          </a>
        </div>
      </div>
    </div>
  );
}
