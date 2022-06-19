import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  signOut as signUserOut,
} from "firebase/auth";

import { auth } from "./app";

const getLoggedInUser = () => {
  return auth.currentUser;
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

const onAuthChange = (callback) => {
  onAuthStateChanged(auth, callback);
};

const updateUserProfile = async (profile) => {
  const currentUser = getLoggedInUser();
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

const signOut = async () => {
  return await signUserOut(auth);
};

export {
  getLoggedInUser,
  signUpWithGoogle,
  createUserWithEmail,
  signInWithEmail,
  onAuthChange,
  updateUserProfile,
  signOut,
};
