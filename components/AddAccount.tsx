
import React from 'react';
import { View } from '../types';
import { BackArrowIcon, CameraIcon, KeyboardIcon } from './Icons';

interface AddAccountProps {
  navigateTo: (view: View) => void;
}

const OptionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title: string; description: string }> = ({ onClick, icon, title, description }) => (
    <button onClick={onClick} className="w-full text-left bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98]">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </button>
);


export const AddAccount: React.FC<AddAccountProps> = ({ navigateTo }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-2">
        <button onClick={() => navigateTo(View.LIST)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
          <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Account</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 space-y-5 flex flex-col justify-center">
        <OptionButton 
          onClick={() => navigateTo(View.SCAN)}
          icon={<CameraIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
          title="Scan QR Code"
          description="Use your camera to automatically set up."
        />
        <OptionButton 
          onClick={() => navigateTo(View.MANUAL)}
          icon={<KeyboardIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
          title="Enter a setup key"
          description="Manually type in your account details."
        />
      </main>
    </div>
  );
};
