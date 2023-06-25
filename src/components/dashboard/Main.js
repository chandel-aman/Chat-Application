//react
import React, { useContext, useState, useEffect, useRef } from "react";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";

//context
import { ChatsContext } from "../../shared/context/chats-context";
import { ContactsContext } from "../../shared/context/contacts-context";
import { AuthContext } from "../../shared/context/auth-context";
import { SocketContext } from "../../shared/context/socket-context";

//third-party imports
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

//custom components
import Message from "./Message";
import Backdrop from "../../shared/UI/Backdrop";

//icons
import AttachmentIcon from "../../assets/icons/attachment-icon";
import MicIcon from "../../assets/icons/mic-icon";
import ThreeDots from "../../assets/icons/3dots";
import SearchIcon from "../../assets/icons/search-icon";
import EmojiIcon from "../../assets/icons/emoji";

//images
import profileImage from "../../assets/images/profile-image.jpg";

//CSS
import classes from "../../styles/main.module.css";
import FileUpload from "../../shared/UI/FileUploads";

//initial values for the form
const initialValues = {
  message: "",
};

//validation schema for yup object
const newMessageSchema = Yup.object().shape({
  message: Yup.string().min(1).required(),
});

const Main = (props) => {
  //state variable
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivedMsg, setArrivedMsg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [typingDetected, setTypingDetected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  //ref
  const lastMessageRef = useRef(null);
  // const chatRef = useRef();

  //extracting from http client hooks
  const { isLoading, sendRequest } = useHttpClient();

  /*
  chats = [{
    name: "example",
    recipients: [],
    .id: "fadsljoi4234lkjadsf",
  }]
  */

  //extracting from contexts
  const { chats, activeConversation, handleNewConversation } =
    useContext(ChatsContext);
  const { contacts } = useContext(ContactsContext);
  const authCtx = useContext(AuthContext);

  //conversation id
  useEffect(() => {
    if (typeof activeConversation === "string") {
      setConversationId(activeConversation);
    } else {
      setConversationId(null);
    }
  }, [activeConversation]);

  const {
    socket,
    online,
    handleSendMessage,
    handleReceiveMessage,
    handleTypingState,
    handleReceiveTypingState,
  } = useContext(SocketContext);

  //if a new conversation is opened
  useEffect(() => {
    setText("");
  }, [conversationId]);

  let activeChat;
  let activeIndex;
  let participants;
  if (conversationId) {
    activeIndex = chats.findIndex((chat) => chat._id === activeConversation);
    if (activeIndex !== -1) {
      activeChat = chats[activeIndex];
      // console.log(activeChat);
    }
  } else {
    //else we know this contact is not in the conversation and active conversation state is an object with phone and id=-1
    activeChat = contacts?.find(
      (contact) => contact?.phone === activeConversation?.phone
    );
    participants = [activeConversation?.phone, authCtx.phone];
  }

  //sending the typing state
  useEffect(() => {
    if (socket && conversationId && authCtx.userId) {
      const typingState = isTyping && !showTyping;
      handleTypingState(
        conversationId,
        authCtx.userId,
        activeChat.participants,
        typingState
      );
    }
  }, [socket, conversationId, authCtx.userId, isTyping]);

  //receiving the typing state
  useEffect(() => {
    if (socket) {
      handleReceiveTypingState(detectTypingStateHandler);
    }
  }, [socket]);

  //authenticating the typing user
  useEffect(() => {
    if (typingDetected && authCtx.userId && conversationId) {
      if (
        activeChat.participants.some(
          (participant) => participant._id === typingDetected.userId
        ) &&
        conversationId === typingDetected.conversationId
      ) {
        setShowTyping(typingDetected.typingState);
      }
    }
  }, [typingDetected]);

  //receiving the messages
  useEffect(() => {
    if (socket == null) return;
    // socket.on("onlineUsers", (users) => handleOnlineMembers(users));
    handleReceiveMessage(setReceiveMessageHandler);

    //clean up function
    return () => socket.off("receiveMessage");
  }, [socket]);

  //adding the arrived message
  useEffect(() => {
    if (arrivedMsg && conversationId) {
      if (arrivedMsg.convId === conversationId) {
        addMessage(arrivedMsg.message);
      }
    }
  }, [arrivedMsg]);

  //sending the message via socket
  useEffect(() => {
    if (inputMsg && conversationId) {
      handleSendMessage(
        inputMsg.message,
        activeChat.participants,
        conversationId
      );
    }

    setInputMsg("");
  }, [inputMsg]);

  //to scroll the last message into view
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ smooth: true });
    }
  });

  // useEffect(() => {
  //   if (chats && chats.length > 0) {
  //     let arrayOfUserIds = new Set();
  //     chats.forEach((chat) =>
  //       chat.participants.forEach((participant) => {
  //         if (participant._id !== authCtx.userId) {
  //           arrayOfUserIds.add(participant._id);
  //         }
  //       })
  //     );
  //     setUserIds(Array.from(arrayOfUserIds));
  //   }
  // }, [chats]);

  //recieve message handler
  const setReceiveMessageHandler = (message) => {
    setArrivedMsg(message);
  };

  //fetching the messages
  useEffect(() => {
    if (conversationId) {
      const fetchMessages = async () => {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/chats/${authCtx.userId}/${conversationId}`
        );
        // console.log(responseData.conversation);
        setMessages(responseData.conversation.messages.message);
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [authCtx.userId, conversationId]);

  //function to append the new message
  const addMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * if the value in activeConversation is a valid mongoose object id then open the respective conversation and when message is sent than add the message to the message array,
   * but if the value in activeConversation is -1 then create a new conversation on the backend when the first message is sent
   */

  //function to handle the submit
  const handleMsgSend = async (event) => {
    const date = new Date();
    event.preventDefault();
    // console.log(text);
    const message = {
      message: {
        text: text,
        sender: { phone: authCtx.phone, name: authCtx.userName },
        tnd: date.toJSON(), //tnd: time and date
        read: { status: false, time: null },
      },
    };
    // console.log(message);
    setInputMsg(message);
    addMessage(message.message);
    // resetForm();
    if (conversationId) {
      console.log(conversationId);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/chats/${authCtx.userId}/${conversationId}/sendMsg`,
          "POST",
          JSON.stringify(message),
          { "Content-Type": "application/json" }
        );
        setText("");
      } catch (error) {
        console.log(error);
      }
    } else {
      //if we do not have a conversation id than create a new conversation
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/chats/${authCtx.userId}/newConv`,
          "POST",
          JSON.stringify({ message, participants }),
          { "Content-Type": "application/json" }
        );
        console.log(responseData);
        setText("");
        handleNewConversation(responseData.newConversation);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //function to handle message sender name for group chats
  const handleMsgSenderName = (message) => {
    const name =
      message.sender.phone !== authCtx.phone
        ? contacts.find((contact) => {
            if (contact.phone === message.sender.phone) return true;
            else return false;
          })
        : "";
    if (name) {
      return name.username;
    } else {
      return message.sender.phone;
    }
  };
  // console.log(activeChat)

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setText((prev) => prev + emoji);
    console.log(emoji);
  };

  //handler function to handle the change in the input message
  const inputMsgChangeHandler = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  //typing state handler
  const handleKeyUp = (event) => {
    const isPrintableKey = event.key.length === 1;
    const isCapsLockOrShift = event.key === "CapsLock" || event.key === "Shift";
    const isValidKey =
      /^[a-zA-Z0-9\s.,?!'"@#$%^&*()_+\-=\[\]{}|\\;:/<>~`]*$/.test(event.key);

    if (isPrintableKey && !isCapsLockOrShift && isValidKey) {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setIsTyping(false);
        setShowTyping(false);
      }, 2000);
      setTimeoutId(newTimeoutId);
      setIsTyping(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleMsgSend(event);
    } else if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      setText(text.substring(0, start) + "\n" + text.substring(end));
      event.target.selectionStart = event.target.selectionEnd = start + 1;
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  //typing state receiver handler
  const detectTypingStateHandler = (data) => {
    setTypingDetected({
      userId: data.userId,
      conversationId: data.conversationId,
      typingState: data.typingState,
    });
  };

  let typingMsg = "";
  if (showTyping)
    if (activeChat.participants.length > 2) {
      const typingUser = activeChat.participants.find(
        (p) => p._id === typingDetected.userId
      );
      typingMsg = `${typingUser.username} is typing`;
    } else {
      typingMsg = "typing...";
    }

  //show upload options handler
  const closeUploadOptionsHandler = () => {
    setShowUpload(false);
  };

  //rendering the content of Main component
  return (
    <div className={classes["main-container"]}>
      {activeConversation && (
        <>
          <header>
            <div className={classes["profile-image"]}>
              <img src={profileImage} alt="desktop profile" />
            </div>
            <div className={classes["name-state"]}>
              <h4>{activeChat?.name || activeChat?.username}</h4>

              {/* {activeChat &&
                activeChat?.participants.length > 0 &&
                online.some(
                  (user) =>
                    activeChat.participants.some(
                      (participant) =>
                        participant._id === user.userId &&
                        participant._id !== authCtx.userId
                    ) && activeChat.participants.length <= 2
                ) && <p>online</p>} */}
              {showTyping ? typingMsg : ""}
            </div>
            <div className={classes["header-icons"]}>
              <div>
                <SearchIcon />
              </div>
              <div>
                <ThreeDots />
              </div>
            </div>
          </header>
          <div className={classes["message-container"]}>
            {messages && messages.length > 0 && (
              <Message
                messages={messages}
                ref={lastMessageRef}
                handleMsgSenderName={handleMsgSenderName}
                activeChat={activeChat}
                conversationId={conversationId}
              />
            )}
          </div>
          <footer>
            <Formik
              initialValues={initialValues}
              // validationSchema={newMessageSchema}
            >
              {({ values }) => (
                <div className={classes.footer}>
                  {showUpload && (
                    <Backdrop
                      onClick={closeUploadOptionsHandler}
                      style={{ "background-color": "transparent" }}
                    />
                  )}
                  <FileUpload
                    show={showUpload}
                    close={closeUploadOptionsHandler}
                  />

                  <div className={classes["message-box"]}>
                    <AttachmentIcon
                      onClick={() => setShowUpload((prev) => !prev)}
                    />
                    <Form onSubmit={handleMsgSend}>
                      <Field
                        as="textarea"
                        type="text"
                        name="message"
                        placeholder="Type your message"
                        autoComplete="off"
                        value={text}
                        onChange={inputMsgChangeHandler}
                        onFocus={() => setShowEmojiPicker(false)}
                        onKeyUp={handleKeyUp}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        required
                      />
                      {/* <button type="submit">Send</button> */}
                    </Form>
                    <EmojiIcon
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    />
                  </div>
                  {showEmojiPicker && (
                    <div className={classes["emoji-picker"]}>
                      <Picker
                        theme="dark"
                        data={data}
                        onEmojiSelect={addEmoji}
                      />
                    </div>
                  )}
                  <div className={classes["mic-icon"]}>
                    <MicIcon />
                  </div>
                </div>
              )}
            </Formik>
          </footer>
        </>
      )}
    </div>
  );
};

export default Main;
