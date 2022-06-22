import React from "react";
import Avatar from "../../Avatar";
import UserTile from "../../UserTile";

import "./styles.scss";

export default function SearchedUsersList({ searchedUsers, addUser, isSearching }) {
  return searchedUsers && searchedUsers.length ? (
    <ul className="searched-users">
      {searchedUsers.map((searchedUser) => {
        const email = searchedUser.email;
        const name = searchedUser.displayName;
        const photoURL = searchedUser.photoURL;
        const uid = searchedUser.uid;

        return (
          <li key={uid}>
            <UserTile
              title={name || "Test Name"}
              subTitle={email}
              photoURL={photoURL}
              action={() => addUser(uid)}
              actionIcon="add"
            />
          </li>
        );
      })}
    </ul>
  ) : isSearching ? (
    <div className="empty-search-message">No User Found</div>
  ) : (
    ""
  );
}
