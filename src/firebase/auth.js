import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from "./app";

const onAuthChange = (callback) => {
  onAuthStateChanged(auth, callback);
};

const updateUserProfile = async (profile) => {
  const currentUser = auth.currentUser;
  const userData = {};

  const name = profile.displayName;
  const photoURL = profile.photoURL;

  if (name) {
    userData.displayName = name;
  }

  if (photoURL) {
    userData.photoURL = photoURL;
  }

  return await updateProfile(currentUser, userData);
};

const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

const createUserWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

const signInWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export { signUpWithGoogle, createUserWithEmail, signInWithEmail, onAuthChange, updateUserProfile };
