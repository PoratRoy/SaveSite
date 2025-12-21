"use client";

import { signIn } from "next-auth/react";
import styles from "./signIn.module.css";
import GoogleIcon from "@/styles/assets/GoogleIcon";

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>
            Sign in to access your saved websites
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => signIn("google", { callbackUrl: "/main" })}
            className={styles.googleButton}
          >
            <span className={styles.iconWrapper}>
              <GoogleIcon />
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
