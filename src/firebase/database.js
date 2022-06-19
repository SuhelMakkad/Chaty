import { ref, set, update } from "firebase/database";
import { db } from "./app";

const createUserDoc = async (userId, name, email, imageUrl) => {
  const usersRef = ref(db, `users/${userId}`);
  const data = {
    username: name,
    email: email,
    profile_picture: imageUrl,
  };

  update(usersRef, data);
};

export { createUserDoc };
