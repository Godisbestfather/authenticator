
export interface Account {
  id: string;
  service: string;
  username: string;
  secret: string;
}

export interface User {
  email: string;
  name?: string;
  // Note: In a real app, this would be a securely hashed password.
  // For this simulation, we're storing it directly.
  password?: string; 
}

export enum View {
  LIST = 'LIST',
  ADD = 'ADD',
  SCAN = 'SCAN',
  MANUAL = 'MANUAL',
  SETTINGS = 'SETTINGS',
  AUTH = 'AUTH',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  SIGN_IN = 'SIGN_IN',
}
