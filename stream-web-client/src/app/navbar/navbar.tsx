"use client";

import { User } from "firebase/auth";
import styles from "./navbar.module.css";
import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signout } from "../firebase/firebase";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <h1>Stream</h1>
      {user && <button className={styles.buttonUpload}>Upload</button>}
      {user ? (
        <button className={styles.button} onClick={signout}>
          Sign Out
        </button>
      ) : (
        <button className={styles.button} onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </nav>
  );
}
