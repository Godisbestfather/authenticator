
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { BackArrowIcon } from '../Icons';

interface SignInProps {
  navigateTo: (view: View) => void;
  signIn: (email: string, password: string) => boolean;
  error: string | null;
  clearError: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ navigateTo, signIn, error, clearError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Clear any existing auth errors when the component mounts
    clearError();
  }, [clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };
  
  const isFormValid = email.trim() && password.trim();

  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-2">
        <button onClick={() => navigateTo(View.AUTH)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
          <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to FusionAuth</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-signin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email-signin"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password-signin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              id="password-signin"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="pt-4">
             <button
                type="submit"
                disabled={!isFormValid}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900 transition-colors"
              >
                Sign In
              </button>
          </div>
        </form>
      </main>
    </div>
  );
};
