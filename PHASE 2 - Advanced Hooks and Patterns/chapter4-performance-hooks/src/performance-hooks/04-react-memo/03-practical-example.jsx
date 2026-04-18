// Practical Example: List Items

import React from "react";

function MessageList({ messages }) {
  return (
    <div>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}

const MessageItem = React.memo(({ message }) => {
  console.log(`Rendering message ${message.id}`);

  return (
    <div>
      <h4>{message.autor}</h4>
      <p>{message.text}</p>
      <small>{message.timestamp}</small>
    </div>
  );
});

export default MessageList