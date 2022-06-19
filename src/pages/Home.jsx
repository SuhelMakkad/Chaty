import React, { useState, useEffect } from "react";

import { signOut } from "../firebase/auth";
import {
  searchUserByEmail,
  addUserToChat,
  getUserDetails,
  setUpUserListListner,
} from "../firebase/database";

import { debounce } from "../utils";

export default function Home() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    updatedConnectedUsers.forEach(async ([uid, chatId]) => {
      userDetailsPromises.push(getUserDetails(uid));
    });

    const fetchedUsers = await Promise.all(userDetailsPromises);

    fetchedUsers.forEach((fetchedUser) => {
      delete fetchedUser.connectedUsers;
    });

    setUserList(fetchedUsers);
  };

  useEffect(() => {
    initiateUser();
  }, []);

  return (
    <div>
      <div>{user ? user.uid : ""}</div>
      <button onClick={signOut}>Sign out</button>

      <div>
        <input type="text" onChange={debounce(handleSearchInputChange, 300)} />
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
          {userList.map((user) => {
            const uid = user.uid;
            const email = user.email;
            const name = user.displayName;

            return <li key={uid}>{name || email || uid}</li>;
          })}
        </ol>
      ) : (
        ""
      )}
    </div>
  );
}
