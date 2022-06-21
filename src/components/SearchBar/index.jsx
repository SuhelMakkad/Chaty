import React from "react";

import "./styles.scss";

function SearchBar({ onChange }) {
  return (
    <div className="search-bar">
      <input
        onChange={onChange}
        id="search-bar__input"
        className="search-bar__input"
        type="text"
        placeholder="Add new user"
      />
      <label className="search-bar__search-icon" htmlFor="search-bar__input">
        <span className="material-icons">search</span>
      </label>
    </div>
  );
}

export default SearchBar;
