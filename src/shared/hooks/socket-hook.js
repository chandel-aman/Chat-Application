//react
import { useState, useEffect, useContext, useCallback } from "react";

//socket client
import { io } from "socket.io-client";

//custom hook to use the details stored in the context
const useSocket = () => {
  //state variables
  const [online, setOnline] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userIds, setUserIds] = useState([]);
  const [data, setData] = useState({ userId: "", chats: null });

  //getting the user id and chats
  const handleGettingData = useCallback((userId, chats) => {
    setData({ userId: userId, chats: chats });
  });

  //useEffect
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      query: {
        userId: data.userId,
        connectedUsers: JSON.stringify(userIds),
      },
    });
    setSocket(newSocket);

    //clean up function
    return () => newSocket.close();
  }, [data.userId, userIds]);

  useEffect(() => {
    if (data.chats && data.chats.length > 0) {
      let arrayOfUserIds = new Set();
      data.chats.forEach((chat) =>
        chat.participants.forEach((participant) => {
          if (participant._id !== data.userId) {
            arrayOfUserIds.add(participant._id);
          }
        })
      );
      //adding the user id
      arrayOfUserIds.add(data.userId);
      setUserIds(Array.from(arrayOfUserIds));
    }
  }, [data.chats]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("onlineUsers", (users) => {
      setOnline(users);
    });

    //clean up function
    return () => socket.off("onlineUsers");
  }, [socket]);

  //send message handler
  const handleSendMessage = useCallback((message, recipients, convId) => {
    if (socket)
      socket.emit("sendMessage", {
        message,
        recipients,
        convId,
      });
  });

  //recieve message handler
  const handleReceiveMessage = useCallback((arrivedMessageHandler) => {
    if (socket)
      socket.on("receiveMessage", (data) => {
        arrivedMessageHandler(data);
      });
  });

  //send reaction handler
  const handleEmojiReaction = useCallback(
    (reaction, recipients, convId, msgId) => {
      if (socket)
        socket.emit("sendReaction", { reaction, recipients, convId, msgId });
    }
  );

  //recieve reaction handler
  const handleReceiveReaction = useCallback((arrivedReactionHandler) => {
    if (socket)
      socket.on("receiveReaction", (data) => {
        // console.log(data);
        arrivedReactionHandler(data);
      });
  });

  //sending typing state
  const handleTypingState = useCallback(
    (conversationId, userId, recipients, typingState) => {
      if (socket && conversationId && userId) {
        socket.emit("typing", { conversationId, userId, recipients, typingState });
      }
    }
  );

  //receiving typing state
  const handleReceiveTypingState = useCallback((detectTypingStateHandler) => {
    if (socket) {
      socket.on("typingDetected", (data) => {
        detectTypingStateHandler(data);
      });
    }
  });

  return {
    socket,
    online,
    handleSendMessage,
    handleReceiveMessage,
    handleGettingData,
    handleEmojiReaction,
    handleReceiveReaction,
    handleTypingState,
    handleReceiveTypingState,
  };
};

export default useSocket;
