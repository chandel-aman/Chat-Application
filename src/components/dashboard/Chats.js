//react
import React, { useContext, useEffect, useState } from "react";

//context
import { ChatsContext } from "../../shared/context/chats-context";
import { AuthContext } from "../../shared/context/auth-context";
import { ContactsContext } from "../../shared/context/contacts-context";
import { SocketContext } from "../../shared/context/socket-context";

//icon
import SearchIcon from "../../assets/icons/search-icon";

//css
import classes from "../../styles/chats.module.css";

//images
import profileImage from "../../assets/images/profile-image.jpg";
import ChatWrapper from "../../shared/UI/ChatWrapper";

//dummy status data
const DUMMY_STATUS = [
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
  { src: profileImage },
];

const Chats = () => {
  //state variable
  const [chatName, setChatName] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //extracting from chat context
  const { chats, handleActiveConversation, activeConversation } =
    useContext(ChatsContext);
  const { phone, userId } = useContext(AuthContext);
  const { contacts } = useContext(ContactsContext);
  const { online } = useContext(SocketContext);

  //state variable
  const [filteredChats, setFilteredChats] = useState([]);

  //function to handle click event on conversation to open the respective chat
  const openConversationHandler = (chatId) => {
    console.log(chatId);
    handleActiveConversation(chatId);
  };

  //function to handle change in the search bar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (chats && chats.length > 0)
      setFilteredChats(
        chats.filter((chat, index) =>
          chatName[index]
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
  };

  useEffect(() => {
    console.log(filteredChats);
  }, [filteredChats]);

  //function to get the name of the chat
  const chatNameHandler = () => {
    if (chats && chats?.length > 0) {
      chats.forEach((chat) => {
        if (!chat.name) {
          chat.participants.forEach((participant) => {
            const matchingContact = contacts.find((contact) => {
              return contact.phone === participant.phone;
            });
            if (matchingContact) {
              setChatName((prev) => [...prev, participant.username]);
            } else if (participant.phone !== phone) {
              setChatName((prev) => [...prev, participant.phone]);
            }
          });
        } else {
          setChatName((prev) => [...prev, chat.name]);
        }
      });
    }
  };

  useEffect(() => {
    chatNameHandler();
  }, [chats, contacts]);
  // console.log(online);
  //return
  
  return (
    <div className={classes["chats-container"]}>
      <div className={classes["search-box"]}>
        <input
          placeholder="Search your friend, or chat"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon />
      </div>
      <div className={classes["status-container"]}>
        <div className={`${classes.status} ${classes.mine}`}>
          <img src={profileImage} alt="desktop profile" />
        </div>
        {DUMMY_STATUS.map((user, index) => (
          <div className={classes.status} key={"image" + index}>
            <img src={user.src} />
          </div>
        ))}
      </div>

      <h3>Chats</h3>
      <ul>
        {chats &&
          chats?.length > 0 &&
          chats.map((conversation, index) => (
            <ChatWrapper
              uniqueKey={conversation._id}
              onClick={() => openConversationHandler(conversation._id)}
              active={activeConversation === conversation._id}
              imgSrc={profileImage}
              chatName={chatName[index]}
              lastMessagePreview="Hello! Testing..."
              time="20:41"
              messageCount={3}
              online={online.some(
                (user) =>
                  conversation.participants.some(
                    (participant) =>
                      participant._id === user.userId &&
                      participant._id !== userId
                  ) && conversation.participants.length <= 2
              )}
            />
          ))}
        {(!searchQuery && chats?.length === 0) ||
          (searchQuery && filteredChats?.length === 0 && (
            <div>No Chats Found</div>
          ))}
      </ul>
    </div>
  );
};

export default Chats;
