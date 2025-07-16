import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

// Sign In
signInWithEmailAndPassword(auth, email, password);

// Sign Up
createUserWithEmailAndPassword(auth, email, password);
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then(result => console.log("Google user:", result.user))
  .catch(err => console.error(err));
// Firebase Authentication setup complete
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider };
export default app;
// Firebase app initialized and exported for use in other parts of the application.         