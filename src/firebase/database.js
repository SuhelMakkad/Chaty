import {
  ref,
  onValue,
  update,
  get,
  query,
  orderByChild,
  limitToFirst,
  startAt,
  endAt,
  set,
  off,
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

const setUpUserListListner = (callback) => {
  const loggedInUser = getLoggedInUser();
  const uid = loggedInUser.uid;

  const connectedUsersRef = ref(db, `users/${uid}/connectedUsers`);
  onValue(connectedUsersRef, (snapshot) => {
    const data = snapshot.val();

    callback(data);
  });
};

const getUserDetails = async (uid) => {
  if (!uid) {
    const loggedInUser = getLoggedInUser();
    uid = loggedInUser.uid;
  }
  const usersRef = ref(db, `users/${uid}`);

  const [res, error] = await to(get(usersRef));

  if (error) {
    return null;
  }

  const user = res.val();
  if (!user) return;
  user.uid = uid;

  return user;
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

const updateConnectedUsers = async (uid, newUserId, chatId) => {
  const connectedUsersRef = ref(db, `users/${uid}/connectedUsers`);
  update(connectedUsersRef, { [newUserId]: chatId });
};

const addUserToChat = async (uid) => {
  const loggedInUser = getLoggedInUser();
  const loggedInUserId = loggedInUser.uid;
  const chatId = hash(loggedInUserId, uid);

  updateConnectedUsers(uid, loggedInUserId, chatId);
  updateConnectedUsers(loggedInUserId, uid, chatId);
};

const startListingForMessage = async (users, callback) => {
  const loggedInUser = getLoggedInUser();
  const loggedInUserId = loggedInUser.uid;

  users.forEach((user) => {
    if (!user) return;

    const chatId = hash(loggedInUserId, user.uid);
    const chatsRef = ref(db, `chats/${chatId}`);

    off(chatsRef);
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      callback(chatId, data);
    });
  });
};

const sendMessage = (chatId, message) => {
  const messageId = message.id;
  const chatsRef = ref(db, `chats/${chatId}/${messageId}`);

  set(chatsRef, message);
};

export {
  createUserDoc,
  setUpUserListListner,
  getUserDetails,
  searchUserByEmail,
  addUserToChat,
  startListingForMessage,
  sendMessage,
};
