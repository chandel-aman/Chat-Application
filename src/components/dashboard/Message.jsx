//react
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  useContext,
} from "react";

//context
import { SocketContext } from "../../shared/context/socket-context";
import { AuthContext } from "../../shared/context/auth-context";

//custom hook
import { useHttpClient } from "../../shared/hooks/http-hook";

//third party imports
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import Picker from "@emoji-mart/react";

//react components
import CSHighlighter from "../../shared/UI/codeSyntaxHighlighter/CSHighlighter";

//icons
import DoubleTick from "../../assets/icons/doubleTick-icon";
import SingleTick from "../../assets/icons/single-tick";

//css
import classes from "../../styles/message.module.css";

//reaction container
const Reaction = forwardRef((props, ref) => {
  //to handle the click event on reaction span
  const handleReactionClick = (event) => {
    const spanValue = event.target.getAttribute("data-value");
    props.handleSetReaction({ spanValue, messageId: props.messageId });
  };
  return (
    <div
      className={`${classes["reaction-container"]} ${
        props.self ? classes.self : ""
      } ${props.show ? classes.show : ""}`}
      onBlur={props.onBlur}
    >
      <span data-value="&#x1f44d;" onClick={handleReactionClick}>
        &#x1f44d;
      </span>
      <span data-value="&#x2764;&#xfe0f;" onClick={handleReactionClick}>
        &#x2764;&#xfe0f;
      </span>
      <span data-value="&#x1f602;" onClick={handleReactionClick}>
        &#x1f602;
      </span>
      <span data-value="&#x1f62e;" onClick={handleReactionClick}>
        &#x1f62e;
      </span>
      <span data-value="&#x1f625;" onClick={handleReactionClick}>
        &#x1f625;
      </span>
      <span data-value="&#x1f64f;" onClick={handleReactionClick}>
        &#x1f64f;
      </span>
      <span
        className={classes["add-icon"]}
        onClick={props.showPicker}
        ref={ref}
      >
        +
      </span>
    </div>
  );
});

const MessageWrapper = forwardRef((props, ref) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(isoWeek);

  //extracting from props
  const { data, messages, activeChat, handleMsgSenderName, conversationId } =
    props;

  //state variable
  const [reaction, setReaction] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState("");
  const [showReactionContainer, setShowReactionContainer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //extracting from the http hook
  const { sendRequest } = useHttpClient();

  //extracting from context
  const { socket, handleEmojiReaction, handleReceiveReaction } =
    useContext(SocketContext);

  const authCtx = useContext(AuthContext);

  //ref
  const pickerRef = useRef();

  // USEEFFECT
  useEffect(() => {
    if (socket) {
      handleReceiveReaction(arrivedReactionHandler);
    }

    return () => socket.off("receiveReaction");
  }, [socket, selectedReaction]);

  // ARRIVED REACTION HANDLER
  const arrivedReactionHandler = (reaction) => {
    if (reaction.convId === data.conversationId) {
      console.log(reaction);
      setSelectedReaction("");
    }
  };

  //reaction handler
  const handleSetReaction = async ({ value, messageId }) => {
    //sending data via socket
    if (value && conversationId) {
      handleEmojiReaction(
        value,
        activeChat.participants,
        conversationId,
        messageId
      );
      setSelectedReaction(value);
    }

    try {
      // const responseData = sendRequest(
      //   `http://localhost:8000/api/chats/${authCtx.userId}/${conversationId}/addReaction`,
      //   "POST",
      //   JSON.stringify({
      //     reaction: value,
      //     senderId: authCtx.userId,
      //     messageId: messageId,
      //   }),
      //   { "Content-Type": "application/json" }
      // );
    } catch (error) {
      console.log(error);
    }

    //IF THE USER AS ALREADY REACTED AND HAS AGAIN MADE A REACTION THEN UPDATE THE PREVIOUS REACTION WITH NEW ONE
    if (reaction.some((obj) => obj.by.toString() === authCtx.userId)) {
      const newReaction = { reaction: value, by: authCtx.userId };
      const updatedReaction = reaction.filter(
        (obj) => obj.by.toString() !== authCtx.userId
      );
      updatedReaction.push(newReaction);

      setReaction(updatedReaction);
    }
    //IF USER WHO HAS NOT REACTED ALREADY REACTS TO A MSG THEN JUST ADD IT TO THE REACTION ARRAY
    else {
      const newReaction = { reaction: value, by: authCtx.userId };
      setReaction((prev) => [...prev, newReaction]);
    }
  };

  const handleToggleReactionContainer = () => {
    setShowReactionContainer((prev) => !prev);
  };

  const handleEmojiPicker = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setReaction(emoji);
    setShowEmojiPicker(false);
    setShowReactionContainer(false);
  };

  const handlePickerClickOutside = (e) => {
    console.log(e.target);
    console.log(pickerRef.current);
    if (pickerRef.current && !pickerRef.current.contains(e.target))
      setShowEmojiPicker(false);
  };

  const handleShowPicker = () => setShowEmojiPicker((prev) => !prev);

  useImperativeHandle(pickerRef, () => ({
    // Expose the handleShowPicker function to the parent component
    handleShowPicker,
  }));

  // check if message is a code snippet
  function isCodeSnippet(message) {
    return message.text.split("\n").some((line) => {
      // check if line starts with 4 spaces or a tab character
      if (line.startsWith("    ") || line.startsWith("\t")) {
        return true;
      }
      // check if line contains one or more programming keywords or symbols
      const keywords = [
        "if",
        "else",
        "for",
        "while",
        "function",
        "class",
        "const",
        "let",
        "var",
        "return",
        "async",
        "await",
        "import",
        "export",
        "try",
        "catch",
        "finally",
        "throw",
        "new",
        "this",
        "null",
        "undefined",
      ];
      const symbols = [
        "{",
        "}",
        "[",
        "]",
        "(",
        ")",
        ".",
        "=",
        "+",
        "-",
        "*",
        "/",
        "%",
        ">",
        "<",
        "==",
        "!=",
      ];
      return (
        keywords.some((keyword) => line.includes(keyword)) ||
        symbols.some((symbol) => line.includes(symbol))
      );
    });
  }

  return (
    <ul>
      {messages &&
        messages.map((message, index) => {
          const lastMessage = messages.length - 1 === index;
          const timeString = dayjs.utc(message.tnd).tz("UTC").format("HH:mm");
          const self = message.sender.phone === authCtx.phone ? true : false;
          const senderName =
            activeChat?.name &&
            message.sender.phone !== authCtx.phone &&
            handleMsgSenderName(message);
          // setReaction(message.reactions);
          return (
            <li
              key={message.tnd}
              ref={lastMessage ? ref : null}
              className={`${classes.list} ${
                index === 0 ? classes["first-message"] : null
              }`}
            >
              <div className={`${classes.textBox} ${self ? classes.self : ""}`}>
                {showEmojiPicker && (
                  <Picker
                    theme="dark"
                    data={data}
                    onEmojiSelect={(e) => handleEmojiPicker(e)}
                    onClickOutside={handlePickerClickOutside}
                  />
                )}
                {showReactionContainer && !showEmojiPicker && (
                  <Reaction
                    handleSetReaction={handleSetReaction}
                    onBlur={() => setShowReactionContainer(false)}
                    self={self}
                    show={showReactionContainer}
                    showPicker={handleShowPicker}
                    ref={pickerRef}
                    messageId={message._id}
                  />
                )}
                {!showEmojiPicker && (
                  <div
                    className={classes.react}
                    onClick={handleToggleReactionContainer}
                  />
                )}
                {senderName && (
                  <h6 className={classes.senderName}>{senderName}</h6>
                )}
                {isCodeSnippet(message) ? (
                  <CSHighlighter snippet={message.text} />
                ) : (
                  <span className={classes.text}>{message.text}</span>
                )}
                <span className={classes["msg-footer"]}>
                  {self && <DoubleTick />}
                  {/* {!self && <SingleTick />} */}
                  <span className={classes.time}>{timeString}</span>
                </span>
                {reaction && reaction.length > 0 && (
                  <div
                    className={`${classes.reaction} ${
                      self ? classes.self : ""
                    }`}
                  >
                    {reaction.map((rxn) => (
                      <span>{rxn.reaction}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
    </ul>
  );
});

export default MessageWrapper;
