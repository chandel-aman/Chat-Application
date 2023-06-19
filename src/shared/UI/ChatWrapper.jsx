import React from "react";

//css
import classes from "../../styles/chatWrapper.module.css";

const ChatWrapper = (props) => {
  const {
    uniqueKey,
    onClick,
    imgSrc,
    chatName,
    lastMessagePreview,
    time,
    messageCount,
    online,
    active
  } = props;
  return (
    <li
      key={uniqueKey}
      onClick={onClick}
      className={`${classes.chat} ${active && classes.active}`}
    >
      <span
        className={`${classes["chat-profile"]} ${online ? classes.online : ""}`}
      >
        <img src={imgSrc} alt="desktop profile of users" />
      </span>
      <span className={classes["chat-details"]}>
        <div>
          <h5>{chatName}</h5>
          <span>{time}</span>
        </div>
        <span className={classes["chat-preview"]}>
          {lastMessagePreview}
          <span className={classes["message-count"]}>{messageCount}</span>
        </span>
      </span>
    </li>
  );
};

export default ChatWrapper;
