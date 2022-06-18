import auth from "./app";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { to } from "../utils";

const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  return await to(signInWithPopup(auth, provider));
};

const createUserWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

const signInWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export { signUpWithGoogle, createUserWithEmail, signInWithEmail };
