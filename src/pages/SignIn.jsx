import React, { useState } from "react";

import {
  signUpWithGoogle,
  createUserWithEmail,
  signInWithEmail,
  updateUserProfile,
} from "../firebase/auth";
import { createUserDoc } from "../firebase/database";

import { to, validateEmail } from "../utils";

export default function SignIn() {
  const [authMode, setAuthMode] = useState("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const changeAuthMode = () => {
    let newAuthMode = "signIn";

    if (authMode === "signIn") {
      newAuthMode = "signUp";
    }

    setAuthMode(newAuthMode);
  };

  const authenticate = async () => {
    const [res, error] = await to(
      authMode === "signUp"
        ? createUserWithEmail(email, password)
        : signInWithEmail(email, password)
    );

    if (!error) {
      return res;
    }

    const errorMessage = error.message;

    let message = "Something went wrong please try again later";

    if (errorMessage.indexOf("email-already-in-use") !== -1) {
      message = "This email is already in use, please sign in to continue";
    }

    if (errorMessage.indexOf("weak-password)") !== -1) {
      message = "Password should be at least 6 characters long";
    }

    if (errorMessage.indexOf("invalid-email)") !== -1) {
      message = "Please enter a valid email";
    }

    if (errorMessage.indexOf("user-not-found)") !== -1) {
      message = "This email is not registerd, please sign up to continue";
    }

    if (errorMessage.indexOf("wrong-password") !== -1) {
      message = "Please enter correct credentials to login";
    }

    setError(message);
    return null;
  };

  const signUpUserWithEmail = async () => {
    setError();

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      setError("Please enter a valid email");
      return;
    }

    if (authMode === "signUp" && password !== confirmPassword) {
      setError("Password confirm password should be the same");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }
    const res = await authenticate();

    if (!res) return;
    console.log(res);

    const user = res.user;
    setUpUserProfile(user);
  };

  const handleSignUpWithGoogle = async () => {
    setError();

    const [res, error] = await to(signUpWithGoogle());

    console.log({ res, error });
    if (error) {
      console.error(error);
      const errorMessage = error.message;

      if (errorMessage.indexOf("popup-closed-by-user") !== -1) {
        return;
      }

      setError("Something went wrong please try again");
      return;
    }

    const user = res.user;
    setUpUserProfile(user);

    console.log(user);
  };

  const setUpUserProfile = (user) => {
    const uid = user.uid;
    const email = user.email;
    const imageUrl = user.photoURL;
    let displayName = user.displayName;

    if (authMode === "signUp") {
      displayName = name;
      const userProfile = {
        displayName,
      };

      updateUserProfile(userProfile);
    }

    createUserDoc(uid, displayName, email, imageUrl);
  };

  return (
    <div>
      <div className="error-message">{error ? error : ""}</div>
      <div>
        <button onClick={handleSignUpWithGoogle}>Continue with Google</button>
      </div>
      {authMode === "signUp" ? (
        <div>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Full Name"
            required
          />
        </div>
      ) : (
        ""
      )}
      <div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="Email"
          required
        />
      </div>
      <div>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
      </div>
      {authMode === "signUp" ? (
        <div>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>
      ) : (
        ""
      )}

      <div>
        <button type="submit" onClick={signUpUserWithEmail}>
          {authMode === "signIn" ? "Continue" : "Creat an Account"}
        </button>
      </div>

      <div>
        <span>{authMode === "signIn" ? "Don't have an account?" : "Already have an account?"}</span>
        <button onClick={changeAuthMode}>{authMode === "signIn" ? "Sign up" : "Login"}</button>
      </div>
    </div>
  );
}
