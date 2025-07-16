
import React from 'react';
import { View, User } from '../types';
import { BackArrowIcon } from './Icons';

interface SettingsProps {
  navigateTo: (view: View) => void;
  user: User | null;
  signOut: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ navigateTo, user, signOut }) => {
  if (!user) {
    // This view should not be reachable without a user.
    // Navigate back to the list as a fallback.
    navigateTo(View.LIST);
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-2">
        <button onClick={() => navigateTo(View.LIST)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
          <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account</h2>
            <div className="mt-4 bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name || 'User'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={signOut}
                      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-md hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors"
                    >
                      Sign Out
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
