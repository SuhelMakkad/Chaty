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

  const handleSearchInputChange = async (e) => {
    const searchText = e.target.value;

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

    setMessages((prev) => {
      if (!prev) {
        return { [chatId]: allMessages };
      }

      return { ...prev, [chatId]: allMessages };
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
    <div>
      <div>{user ? user.uid : ""}</div>
      <button onClick={signOut}>Sign out</button>

      <div>
        <input
          onChange={debounce(handleSearchInputChange, 300)}
          type="text"
          placeholder="Add new user"
        />
      </div>

      {searchedUsers && searchedUsers.length ? (
        <ul>
          {searchedUsers.map((searchedUser) => {
            const email = searchedUser.email;
            const name = searchedUser.displayName;
            const uid = searchedUser.uid;

            return (
              <li key={uid}>
                <div>{uid}</div>
                <div>{email}</div>
                <div>{name}</div>
                <button onClick={() => addUser(uid)}>Add</button>
              </li>
            );
          })}
        </ul>
      ) : isSearching ? (
        "No User Found"
      ) : (
        ""
      )}

      {userList && userList.length ? (
        <ol>
          {userList.map((usr) => {
            const uid = usr.uid;
            const email = usr.email;
            const name = usr.displayName;

            return (
              <li
                key={uid}
                onClick={() => {
                  setSelectedUser(usr);
                }}
              >
                {name || email || uid}
              </li>
            );
          })}
        </ol>
      ) : (
        ""
      )}

      {selectedUser ? (
        <div>
          <div>{chatIdMap[selectedUser.uid]}</div>

          {selectedChatMessages && selectedChatMessages.length
            ? selectedChatMessages.map((message) => {
                return <div key={message.id}>{message.value}</div>;
              })
            : ""}

          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Enter your message"
          />

          <div>
            <button onClick={handleMessageSend}>Send</button>
          </div>
        </div>
      ) : (
        "No User Selected"
      )}
    </div>
  );
}
