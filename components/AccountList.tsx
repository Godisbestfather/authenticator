
import React from 'react';
import { Account, View } from '../types';
import { AccountItem } from './AccountItem';
import { PlusIcon, SettingsIcon } from './Icons';

interface AccountListProps {
  accounts: Account[];
  navigateTo: (view: View) => void;
  onSettingsClick: () => void;
}

export const AccountList: React.FC<AccountListProps> = ({ accounts, navigateTo, onSettingsClick }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FusionAuth</h1>
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open settings"
        >
          <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </header>

      <main className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
        {accounts.length > 0 ? (
          accounts.map(account => <AccountItem key={account.id} account={account} />)
        ) : (
          <div className="text-center h-full flex flex-col justify-center items-center px-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Accounts Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">Tap the '+' button to add your first account and enhance your security.</p>
          </div>
        )}
      </main>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => navigateTo(View.ADD)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Add new account"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
