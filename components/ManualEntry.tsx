
import React, { useState } from 'react';
import { View } from '../types';
import { BackArrowIcon } from './Icons';

interface ManualEntryProps {
  navigateTo: (view: View) => void;
  addAccount: (service: string, username: string, secret: string) => void;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({ navigateTo, addAccount }) => {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.trim() || !secret.trim()) {
      setError('Service name and secret key are required.');
      return;
    }
    // Basic validation for secret key (remove spaces)
    const sanitizedSecret = secret.replace(/\s/g, '').toUpperCase();
    if (sanitizedSecret.length < 8) {
        setError('Secret key seems too short.');
        return;
    }

    addAccount(service, username, sanitizedSecret);
    navigateTo(View.LIST);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-2">
        <button onClick={() => navigateTo(View.ADD)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
          <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Enter Setup Key</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name</label>
            <input
              type="text"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Google, GitHub"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account (Username/Email)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., user@example.com"
            />
          </div>
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
            <input
              type="text"
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Paste secret key here"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="pt-4">
             <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
              >
                Save Account
              </button>
          </div>
        </form>
      </main>
    </div>
  );
};
