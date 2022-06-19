import React, { useState } from "react";

import { signOut } from "../firebase/auth";
import { searchUserByEmail, addUserToChat } from "../firebase/database";

import { debounce } from "../utils";

export default function Home() {
  const [searchedUsers, setSearchedUsers] = useState([]);

  const handleSearchInputChange = async (e) => {
    const searchText = e.target.value;
    const users = await searchUserByEmail(searchText);

    setSearchedUsers(users);
  };

  const addUser = (uid) => {
    console.log(uid);
    addUserToChat(uid);
  };

  return (
    <div>
      <button onClick={signOut}>Sign out</button>

      <div>
        <input type="text" onChange={debounce(handleSearchInputChange, 300)} />
      </div>

      {searchedUsers && searchedUsers.length ? (
        <ul>
          {searchedUsers.map((user) => {
            const email = user.email;
            const name = user.displayName;
            const uid = user.uid;

            return (
              <li key={uid}>
                <span>{email}</span>
                <span>{name}</span>
                <button onClick={() => addUser(uid)}>Add</button>
              </li>
            );
          })}
        </ul>
      ) : (
        "No User Found"
      )}
    </div>
  );
}
