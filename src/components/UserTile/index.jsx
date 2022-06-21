import React from "react";

import Avatar from "../Avatar";

import "./styles.scss";

function UserTile({ photoURL, title, subTitle }) {
  return (
    <div className="user-tile">
      <Avatar photoURL={photoURL} />

      <div className="user-tile__text">
        <span className="user-tile__title">{title}</span>
        <span className="user-tile__sub-title"> {subTitle}</span>
      </div>
    </div>
  );
}

export default UserTile;
