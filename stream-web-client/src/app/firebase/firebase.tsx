import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ9Smd7_Ciq1uDESZgysVIcMPRyWRl0NY",
  authDomain: "stream-901ca.firebaseapp.com",
  projectId: "stream-901ca",
  storageBucket: "stream-901ca.appspot.com",
  messagingSenderId: "40974972242",
  appId: "1:40974972242:web:c8a1e67cbdf890c7b4368b",
  measurementId: "G-5LL7Z3RZ57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to sign in with Google and handle new users
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export const signout = async () => {
  await auth.signOut();
};

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
