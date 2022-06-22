import React from "react";

import UserTile from "../UserTile";
import UserMessage from "../UserMessage";

import "./styles.scss";

function MessagesSection({
  user,
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

      <div className="messages">
        <ul className="messages__list">
          {selectedChatMessages && selectedChatMessages.length
            ? selectedChatMessages.map((message) => (
                <li
                  className={`messages__item messages__item--${
                    message.sentBy === user.uid ? "sent" : "recived"
                  }`}
                  key={message.id}
                >
                  <UserMessage
                    loggedInUserId={user.uid}
                    sentBy={message.sentBy}
                    value={message.value}
                  />
                </li>
              ))
            : ""}
        </ul>

        <div className="messages__send">
          <input
            className="messages__input"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Enter your message"
          />

          <button className="messages__send-btn" onClick={handleMessageSend}>
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    "No User Selected"
  );
}
export default MessagesSection;
