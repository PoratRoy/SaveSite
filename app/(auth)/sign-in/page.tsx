"use client";

import { signIn } from "next-auth/react";
import styles from "./signIn.module.css";

export default function SignInPage() {
  const handleGuestLogin = () => {
    window.location.href = "/main";
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <svg
              className={styles.siteLogo}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 18L5 21V5Z"
                fill="#2663EB"
              />
            </svg>
            <h1>SaveSite</h1>
          </div>

          <h2 className={styles.signinTitle}>Sign in to SaveSite</h2>

          <div className={styles.cardBody}>
            <button
              className={styles.btnGoogle}
              onClick={() => signIn("google", { callbackUrl: "/main" })}
            >
              <svg
                className={styles.googleIcon}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.0455H15.3818C15.15 13.2955 14.4409 14.3591 13.3818 15.0682V17.5682H16.6091C18.5 15.8273 19.6 13.2591 19.6 10.2273Z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20C12.7 20 14.9636 19.1045 16.6091 17.5682L13.3818 15.0682C12.4864 15.6682 11.3409 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.4 11.8864H1.06364V14.4727C2.70909 17.7364 6.09091 20 10 20Z"
                  fill="#34A853"
                />
                <path
                  d="M4.4 11.8864C4.19545 11.2636 4.08182 10.6 4.08182 9.90909C4.08182 9.21818 4.19545 8.55455 4.4 7.93182V5.34545H1.06364C0.386364 6.69091 0 8.25 0 9.90909C0 11.5682 0.386364 13.1273 1.06364 14.4727L4.4 11.8864Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.79545C11.4682 3.79545 12.7818 4.3 13.8182 5.29091L16.6545 2.45455C14.9591 0.877273 12.6955 0 10 0C6.09091 0 2.70909 2.26364 1.06364 5.34545L4.4 7.93182C5.19091 5.55455 7.39545 3.79545 10 3.79545Z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <button className={styles.btnGuest} onClick={handleGuestLogin}>
              Continue as Guest (Read Only)
            </button>
          </div>

          <div className={styles.cardFooter}>
            <p>
              By continuing, you agree to our <a href="#">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
