import {
  ref,
  update,
  get,
  push,
  query,
  orderByChild,
  limitToFirst,
  startAt,
  endAt,
} from "firebase/database";
import { db } from "./app";
import { getLoggedInUser } from "./auth";

import { to, hash } from "../utils";

const createUserDoc = async (userId, name, email, imageUrl) => {
  const usersRef = ref(db, `users/${userId}`);
  const data = {
    displayName: name,
    email: email,
    photoURL: imageUrl,
  };

  update(usersRef, data);
};

const searchUserByEmail = async (searchText) => {
  if (!searchText) return;

  const usersRef = ref(db, "users");
  const queryConstraints = [
    limitToFirst(5),
    orderByChild("email"),
    startAt(searchText),
    endAt(`${searchText}\uf8ff`),
  ];
  const que = query(usersRef, ...queryConstraints);
  const [snapshot, error] = await to(get(que));

  if (error) {
    return [];
  }

  const users = [];
  snapshot.forEach((childSnapshot) => {
    const user = childSnapshot.val();
    const uid = childSnapshot.key;
    user.uid = uid;
    users.push(user);
  });

  return users;
};

const updateUserChatIds = async (uid, uniqHash) => {
  const chatIdsRef = ref(db, `users/${uid}/chatIds`);
  const [snapshot, error] = await to(get(chatIdsRef));

  const chatIds = [uniqHash];
  if (!error) {
    snapshot.forEach((childSnapshot) => {
      const chatId = childSnapshot.val();
      chatIds.push(chatId);
    });
  }

  const usersRef = ref(db, `users/${uid}`);
  update(usersRef, { chatIds: [...new Set(chatIds)] });
};

const addUserToChat = async (uid) => {
  const loggedInUser = getLoggedInUser();
  const loggedInUserId = loggedInUser.uid;
  const uniqHash = hash(loggedInUserId, uid);

  updateUserChatIds(uid, uniqHash);
  updateUserChatIds(loggedInUserId, uniqHash);
};

export { createUserDoc, searchUserByEmail, addUserToChat };
