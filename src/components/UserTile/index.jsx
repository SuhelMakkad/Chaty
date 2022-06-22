import React from "react";

import Avatar from "../Avatar";

import "./styles.scss";

function UserTile({ photoURL, title, subTitle, action, actionIcon, className }) {
  return (
    <div className={`user-tile ${className}`}>
      <Avatar photoURL={photoURL} />

      <div className="user-tile__text">
        <span className="user-tile__title">{title}</span>
        <span className="user-tile__sub-title"> {subTitle}</span>
      </div>

      {action && (
        <button onClick={action} className="user-tile__action-btn">
          <span className="material-icons">{actionIcon}</span>
        </button>
      )}
    </div>
  );
}

export default UserTile;
