
import React from 'react';
import { View } from '../../types';
import { BackArrowIcon, GoogleIcon, AppleIcon } from '../Icons';

interface AuthProps {
  navigateTo: (view: View) => void;
  signInWithProvider: (provider: 'google' | 'apple') => void;
}

const ProviderButton: React.FC<{ provider: 'google' | 'apple', onClick: () => void }> = ({ provider, onClick }) => {
    const isGoogle = provider === 'google';
    const Icon = isGoogle ? GoogleIcon : AppleIcon;
    const text = isGoogle ? 'Continue with Google' : 'Continue with Apple';
    
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
            <Icon className="w-5 h-5" />
            <span>{text}</span>
        </button>
    );
};

export const Auth: React.FC<AuthProps> = ({ navigateTo, signInWithProvider }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-4 flex items-center space-x-2">
        <button onClick={() => navigateTo(View.LIST)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
          <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </header>
      <main className="flex-1 p-4 sm:p-6 flex flex-col justify-center items-center text-center">
        <div className="w-full max-w-xs space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A safe place for your codes.</h1>
          <div className="space-y-3">
             <ProviderButton provider="google" onClick={() => signInWithProvider('google')} />
             <ProviderButton provider="apple" onClick={() => signInWithProvider('apple')} />
          </div>

          <div className="flex items-center w-full">
            <hr className="flex-grow border-gray-200 dark:border-gray-700"/>
            <span className="mx-4 text-xs font-medium text-gray-500 dark:text-gray-400">or</span>
            <hr className="flex-grow border-gray-200 dark:border-gray-700"/>
          </div>

          <button
            onClick={() => navigateTo(View.CREATE_ACCOUNT)}
            className="w-full py-3 px-4 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Create account
          </button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                By signing up, you agree to our <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a>.
            </p>
          </div>

        </div>
      </main>
      <footer className="p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigateTo(View.SIGN_IN)} className="font-medium text-blue-600 hover:underline">Sign in</button>
        </p>
      </footer>
    </div>
  );
};
