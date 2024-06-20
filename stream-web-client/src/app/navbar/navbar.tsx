"use client";

import { User } from "firebase/auth";
import styles from "./navbar.module.css";
import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signout } from "../firebase/firebase";
import Upload from "./upload";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      console.log("Auth changed:", user); // Debug line
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link href="/" legacyBehavior>
        <a className={styles.stream}>
          <h1>Stream</h1>
        </a>
      </Link>
      {user && <Upload />}
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
