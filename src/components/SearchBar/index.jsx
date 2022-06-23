import React, { useEffect, useState } from "react";

import SearchedUsersList from "./SearchedUsersList";

import "./styles.scss";

function SearchBar({ handleSearchInputChange, searchedUsers, addUser, isSearching }) {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    handleSearchInputChange(searchText);
  }, [searchText]);
  return (
    <div className="search-bar">
      <label className="search-bar__search-icon" htmlFor="search-bar__input">
        <span onClick={() => setSearchText("")} className="material-icons cp">
          {searchText ? "close" : "search"}
        </span>
      </label>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        id="search-bar__input"
        className="search-bar__input"
        type="text"
        autoComplete="off"
        placeholder="Add new user"
      />
      <SearchedUsersList
        searchedUsers={searchedUsers}
        addUser={addUser}
        isSearching={isSearching}
      />
    </div>
  );
}

export default SearchBar;
