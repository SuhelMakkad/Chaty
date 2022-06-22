import React from "react";

import UserTile from "../UserTile";
import Divider from "../Divider";
import SearchBar from "../SearchBar";

import "./styles.scss";

function UserListSection({
  user,
  signOut,
  handleSearchInputChange,
  searchedUsers,
  isSearching,
  userList,
  setSelectedUser,
  addUser,
  chatIdMap,
  messages,
}) {
  return (
    <div className="right-section">
      {user && <UserTile title={user.displayName} photoURL={user.photoURL} />}

      {/* <button onClick={signOut}>Sign out</button> */}

      <SearchBar
        handleSearchInputChange={handleSearchInputChange}
        searchedUsers={searchedUsers}
        addUser={addUser}
        isSearching={isSearching}
      />

      {userList && userList.length > 0 ? (
        <ol>
          {userList.map((usr, index) => {
            if (!usr) return "";

            const uid = usr.uid;
            const email = usr.email;
            const name = usr.displayName;
            const photoURL = usr.photoURL;
            const chatId = chatIdMap[uid];
            const messagesForThisChat = messages[chatId];

            let lastMessage;
            let lastMessageText = "";

            if (messagesForThisChat) {
              lastMessage = messagesForThisChat[messagesForThisChat.length - 1];
              lastMessageText = lastMessage ? lastMessage.value : "";
            }

            return (
              <li
                key={uid}
                onClick={() => {
                  setSelectedUser(usr);
                }}
              >
                <UserTile photoURL={photoURL} title={name || email} subTitle={lastMessageText} />
                {index < userList.length - 1 && <Divider />}
              </li>
            );
          })}
        </ol>
      ) : (
        ""
      )}
    </div>
  );
}

export default UserListSection;
