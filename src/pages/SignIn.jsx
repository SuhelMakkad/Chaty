import { useState } from "react";

import { auth, firebase } from "../firebase/config";

import { to, validateEmail } from "../utils";

export default function SignIn() {
  const [authMode, setAuthMode] = useState("signIn");
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
        ? auth.createUserWithEmailAndPassword(email, password)
        : auth.signInWithEmailAndPassword(email, password)
    );

    if (!error) return res;

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

  const SignInUserWithEmail = async () => {
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
    const res = await to(authenticate());

    console.log({ res });
    if (!res) return;
  };

  const signUpWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const [res, error] = await to(auth.signInWithPopup(provider));

    console.log({ res, error });

    if (error) {
      console.error(error);
      setError("Something went wrong please try again later");
      return;
    }

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = res.credential;
    const token = credential.accessToken;
    const user = res.user;
    // ...
  };

  return (
    <div>
      <div className="error-message">{error ? error : ""}</div>
      <div>
        <button onClick={signUpWithGoogle}>Continue with Google</button>
      </div>
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
        <button type="submit" onClick={SignInUserWithEmail}>
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
