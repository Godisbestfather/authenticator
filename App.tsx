
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Account, View, User } from './types';
import { AccountList } from './components/AccountList';
import { AddAccount } from './components/AddAccount';
import { ScanQrCode } from './components/ScanQrCode';
import { ManualEntry } from './components/ManualEntry';
import { Settings } from './components/Settings';
import { Auth } from './components/auth/Auth';
import { CreateAccount } from './components/auth/CreateAccount';
import { SignIn } from './components/auth/SignIn';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('fusionauth-user', null);
  const [users, setUsers] = useLocalStorage<User[]>('fusionauth-users', []);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.LIST);
  const [authError, setAuthError] = useState<string | null>(null);

  const getStorageKey = (currentUser: User | null): string => {
    return currentUser ? `fusionauth-accounts-${currentUser.email}` : 'fusionauth-accounts-guest';
  };
  
  useEffect(() => {
    const key = getStorageKey(user);
    try {
      const item = window.localStorage.getItem(key);
      setAccounts(item ? JSON.parse(item) : []);
    } catch (error) {
      console.error("Failed to load accounts:", error);
      setAccounts([]);
    }
  }, [user]);

  const updateAndPersistAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    const key = getStorageKey(user);
    try {
      window.localStorage.setItem(key, JSON.stringify(newAccounts));
    } catch (error) {
      console.error("Failed to save accounts:", error);
    }
  };

  const addAccount = (service: string, username: string, secret: string) => {
    const newAccount: Account = { id: new Date().toISOString(), service, username, secret };
    updateAndPersistAccounts([...accounts, newAccount]);
  };

  const handleSuccessfulLogin = (loggedInUser: User) => {
    const guestKey = getStorageKey(null);
    const guestAccountsJSON = localStorage.getItem(guestKey);
    const guestAccounts: Account[] = guestAccountsJSON ? JSON.parse(guestAccountsJSON) : [];

    const userKey = getStorageKey(loggedInUser);
    const userAccountsJSON = localStorage.getItem(userKey);
    const userAccounts: Account[] = userAccountsJSON ? JSON.parse(userAccountsJSON) : [];
    
    const mergedAccountsMap = new Map<string, Account>();
    [...userAccounts, ...guestAccounts].forEach(acc => mergedAccountsMap.set(acc.secret, acc));
    const finalAccounts = Array.from(mergedAccountsMap.values());

    localStorage.setItem(userKey, JSON.stringify(finalAccounts));
    if (guestAccounts.length > 0) {
      localStorage.removeItem(guestKey);
    }

    setUser(loggedInUser);
    setCurrentView(View.LIST);
    setAuthError(null);
  };

  const createAccount = (name: string, email: string, password: string): boolean => {
    if (users.some(u => u.email === email)) {
      setAuthError("An account with this email already exists.");
      return false;
    }
    const newUser: User = { name, email, password };
    setUsers([...users, newUser]);
    handleSuccessfulLogin(newUser);
    return true;
  };

  const signIn = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      handleSuccessfulLogin(foundUser);
      return true;
    }
    setAuthError("Invalid email or password.");
    return false;
  };

  const signInWithProvider = (provider: 'google' | 'apple') => {
    // This is a simulation. In a real app, this would involve an OAuth flow.
    const email = `${provider}-user@example.com`;
    let userToLogin = users.find(u => u.email === email);

    if (!userToLogin) {
      userToLogin = { email, name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` };
      setUsers([...users, userToLogin]);
    }
    handleSuccessfulLogin(userToLogin);
  };

  const signOut = () => {
    setUser(null);
    setCurrentView(View.LIST);
  };

  const handleSettingsClick = () => {
    if (user) {
      setCurrentView(View.SETTINGS);
    } else {
      setCurrentView(View.AUTH);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.ADD:
        return <AddAccount navigateTo={setCurrentView} />;
      case View.SCAN:
        return <ScanQrCode navigateTo={setCurrentView} addAccount={addAccount} />;
      case View.MANUAL:
        return <ManualEntry navigateTo={setCurrentView} addAccount={addAccount} />;
      case View.SETTINGS:
        return <Settings navigateTo={setCurrentView} user={user} signOut={signOut} />;
      case View.AUTH:
        return <Auth navigateTo={setCurrentView} signInWithProvider={signInWithProvider} />;
      case View.CREATE_ACCOUNT:
        return <CreateAccount navigateTo={setCurrentView} createAccount={createAccount} error={authError} clearError={() => setAuthError(null)}/>;
      case View.SIGN_IN:
        return <SignIn navigateTo={setCurrentView} signIn={signIn} error={authError} clearError={() => setAuthError(null)}/>;
      case View.LIST:
      default:
        return <AccountList accounts={accounts} navigateTo={setCurrentView} onSettingsClick={handleSettingsClick} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-200 dark:bg-gray-800 font-sans antialiased flex items-center justify-center">
      <div className="max-w-md w-full h-full sm:h-[90vh] sm:max-h-[800px] bg-gray-50 dark:bg-gray-900 shadow-2xl rounded-none sm:rounded-3xl overflow-hidden relative">
          {renderView()}
      </div>
    </div>
  );
}

export default App;
