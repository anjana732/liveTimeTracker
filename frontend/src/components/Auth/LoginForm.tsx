import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Clock } from 'lucide-react';
import { useAuthStore, User } from '../../store/authStore';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/server/time_tracker_function/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          password 
        }),
      });

      console.log('Request URL:', response.url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || errorData.data?.message || 'Login failed');
        } catch (e) {
          throw new Error('Login failed - server error');
        }
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data || !data.data) {
        throw new Error('Invalid response format');
      }

      const userData = data.data;

      const user: User = {
        id: userData.ROWID,
        userName: userData.userName,
        email: userData.email,
        name: userData.userName,
        role: email.includes('admin') ? 'admin' : 'intern'
      };
      
      login(user);
      
   
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }

  };

  const handleAdminLogin = () => {
    navigate('/AdminLogin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-2xl">
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            DSV 360
          </h1>
          <p className="text-gray-600 mt-2">Track your work hours efficiently</p>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Don't have an account? Sign up
            </button>
            <br></br>
            <button
              type="button"
              onClick={handleAdminLogin}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              You are Admin?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}