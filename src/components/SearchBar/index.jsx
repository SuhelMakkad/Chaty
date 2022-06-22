import React, { useState } from "react";

import SearchedUsersList from "./SearchedUsersList";

import "./styles.scss";

function SearchBar({ handleSearchInputChange, searchedUsers, addUser, isSearching }) {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="search-bar">
      <input
        value={searchText}
        onChange={(e) => {
          const searchTxt = e.target.value;
          console.log(searchTxt);
          setSearchText(searchTxt);
          handleSearchInputChange(searchTxt);
        }}
        id="search-bar__input"
        className="search-bar__input"
        type="text"
        autoComplete="off"
        placeholder="Add new user"
      />
      <label className="search-bar__search-icon" htmlFor="search-bar__input">
        <span onClick={() => setSearchText("")} className="material-icons cp">
          {searchText ? "close" : "search"}
        </span>
      </label>

      <SearchedUsersList
        searchedUsers={searchedUsers}
        addUser={addUser}
        isSearching={isSearching}
      />
    </div>
  );
}

export default SearchBar;
