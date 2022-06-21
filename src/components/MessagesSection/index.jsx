import React from "react";

function MessagesSection({
  chatIdMap,
  selectedUser,
  selectedChatMessages,
  message,
  setMessage,
  handleMessageSend,
}) {
  return (
    <div>
      {selectedUser ? (
        <div>
          <div>{chatIdMap[selectedUser.uid]}</div>

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
      )}
    </div>
  );
}

export default MessagesSection;
