import React from "react";

import UserTile from "../UserTile";

import "./styles.scss";

function MessagesSection({
  chatIdMap,
  selectedUser,
  selectedChatMessages,
  message,
  setMessage,
  handleMessageSend,
}) {
  return selectedUser ? (
    <div className="right-section-wrapper">
      <UserTile
        photoURL={selectedUser.photoURL}
        title={selectedUser.displayName}
        subTitle={selectedUser.email}
        className="selected-chat-top-bar"
      />

      {selectedChatMessages && selectedChatMessages.length
        ? selectedChatMessages.map((message) => {
            return <div key={message.id}>{message.value}</div>;
          })
        : ""}

      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        placeholder="Enter your message"
      />

      <div>
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  ) : (
    "No User Selected"
  );
}
export default MessagesSection;
