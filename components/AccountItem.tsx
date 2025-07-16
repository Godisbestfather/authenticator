
import React, { useState, useEffect } from 'react';
import { useOtp } from '../hooks/useOtp';
import { Account } from '../types';
import { CircularProgress } from './CircularProgress';
import { CheckIcon } from './Icons';

export const AccountItem: React.FC<{ account: Account }> = ({ account }) => {
  const { otp, progress } = useOtp(account.secret);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(otp.replace(/\s/g, ''));
    setCopied(true);
  };

  const formattedOtp = `${otp.substring(0, 3)} ${otp.substring(3, 6)}`;
  const isExpiring = progress < (5 / 30);

  return (
    <div
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCopy()}
      className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-between space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
    >
      <div className="flex-1 min-w-0">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{account.service}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{account.username}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
            <p className={`text-3xl font-mono tracking-wider transition-colors duration-300 ${isExpiring ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400'}`}>
                {formattedOtp}
            </p>
             <div className="h-4 mt-1">
                {copied && <p className="text-sm text-green-600 dark:text-green-400 animate-pulse">Copied!</p>}
             </div>
        </div>
        <div className="relative">
          <CircularProgress progress={progress} size={52} strokeWidth={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            {copied && <CheckIcon className="w-6 h-6 text-green-500" />}
          </div>
        </div>
      </div>
    </div>
  );
};
