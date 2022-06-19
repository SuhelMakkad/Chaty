import {
  ref,
  update,
  get,
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

const updateConnectedUsers = async (uid, chatIdAndUid) => {
  const connectedUsersRef = ref(db, `users/${uid}/connectedUsers`);
  const [snapshot, error] = await to(get(connectedUsersRef));

  const connectedUsers = [chatIdAndUid];
  if (!error) {
    snapshot.forEach((childSnapshot) => {
      const chatId = childSnapshot.val();
      connectedUsers.push(chatId);
    });
  }

  const usersRef = ref(db, `users/${uid}`);
  update(usersRef, { connectedUsers: [...new Set(connectedUsers)] });
};

const addUserToChat = async (uid) => {
  const loggedInUser = getLoggedInUser();
  const loggedInUserId = loggedInUser.uid;
  const chatId = hash(loggedInUserId, uid);

  updateConnectedUsers(uid, { uid: loggedInUserId, chatId });
  updateConnectedUsers(loggedInUserId, { uid, chatId });
};

export { createUserDoc, searchUserByEmail, addUserToChat };
