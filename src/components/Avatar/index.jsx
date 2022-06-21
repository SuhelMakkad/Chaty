import React from "react";

import "./styles.scss";

function Avatar({ photoURL }) {
  return photoURL ? (
    <img className="avatar-circle" src={photoURL} alt="Profile Picture" />
  ) : (
    <div className="avatar-circle"></div>
  );
}

export default Avatar;
