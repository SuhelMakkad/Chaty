import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { signOut } from "../firebase/auth";
import {
  searchUserByEmail,
  addUserToChat,
  getUserDetails,
  setUpUserListListner,
  startListingForMessage,
  sendMessage,
} from "../firebase/database";

import { debounce } from "../utils";

import MessagesSection from "../components/MessagesSection";
import UserListSection from "../components/UserListSection";

import "../scss/main.scss";

export default function Home() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [chatIdMap, SetChatIdMap] = useState({});

  const handleSearchInputChange = async (searchText) => {
    if (!searchText.length) {
      setIsSearching(false);
      setSearchedUsers([]);
      return;
    }
    const searchedUsers = await searchUserByEmail(searchText);

    const filtered = searchedUsers.filter((searchedUser) => searchedUser.uid !== user.uid);

    setIsSearching(true);
    setSearchedUsers(filtered);
  };

  const addUser = (uid) => {
    addUserToChat(uid);
  };

  const initiateUser = async () => {
    const user = await getUserDetails();

    if (!user) {
      signOut();
      return;
    }

    setUser(user);
    setUpUserListListner(fetchUserList);
  };

  const fetchUserList = async (updatedConnectedUsers) => {
    if (!updatedConnectedUsers) return;

    updatedConnectedUsers = Object.entries(updatedConnectedUsers);

    const userDetailsPromises = [];
    const chatIdAndUserIdMap = {};
    updatedConnectedUsers.forEach(async ([uid, chatId]) => {
      chatIdAndUserIdMap[uid] = chatId;
      userDetailsPromises.push(getUserDetails(uid));
    });

    SetChatIdMap(chatIdAndUserIdMap);

    const fetchedUsers = await Promise.all(userDetailsPromises);

    fetchedUsers.forEach((fetchedUser) => {
      if (!fetchedUser) return;
      delete fetchedUser.connectedUsers;
    });

    setUserList(fetchedUsers);
  };

  const handleIncommingMessages = (chatId, messagesObj) => {
    if (!messagesObj) return;

    const allMessages = [];
    Object.entries(messagesObj).forEach(([id, messages]) => {
      messages.id = id;
      allMessages.push(messages);
    });

    const sortedByTimestamp = allMessages.sort((a, b) => a.timestamp - b.timestamp);

    setMessages((prev) => {
      if (!prev) {
        return { [chatId]: sortedByTimestamp };
      }

      return { ...prev, [chatId]: sortedByTimestamp };
    });
  };

  const setMessagesListner = async () => {
    if (!userList || !userList.length) return;

    startListingForMessage(userList, handleIncommingMessages);
  };

  const handleMessageSend = async () => {
    const timestamp = Date.now();
    const chatId = user.connectedUsers[selectedUser.uid];
    const messageObj = {
      id: uuid(),
      type: "text",
      value: message,
      timestamp,
    };
    sendMessage(chatId, messageObj);
  };

  useEffect(() => {
    if (!selectedUser) return;

    const selectedUserId = selectedUser.uid;
    const chatId = chatIdMap[selectedUserId];

    if (!chatId) return;
    const selectedMessage = messages[chatId];

    setSelectedChatMessages(selectedMessage);
  }, [selectedUser, messages]);

  useEffect(() => {
    setMessagesListner();
  }, [userList]);

  useEffect(() => {
    initiateUser();
  }, []);

  return (
    <main className="main">
      <UserListSection
        handleSearchInputChange={debounce(handleSearchInputChange, 300)}
        isSearching={isSearching}
        searchedUsers={searchedUsers}
        setSelectedUser={setSelectedUser}
        signOut={signOut}
        user={user}
        userList={userList}
        addUser={addUser}
        chatIdMap={chatIdMap}
        messages={messages}
      />
      <MessagesSection
        message={message}
        chatIdMap={chatIdMap}
        handleMessageSend={handleMessageSend}
        selectedChatMessages={selectedChatMessages}
        selectedUser={selectedUser}
        setMessage={setMessage}
      />
    </main>
  );
}
