//React
import { useCallback, useState } from "react";

//context provider
const useChats = () => {
  //state variables
  const [chats, setChats] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  //function to handle contacts
  const handleChats = useCallback((conversation) => {
    setChats(conversation);
  });

  //function to handle opening of conversation
  const handleActiveConversation = (conv_id) => {
    setActiveConversation(conv_id);
  };

  //function to add new conversation
  const handleNewConversation = (newConversation) => {
    setChats((prev) => [...prev, newConversation]);
  };

  return {
    chats,
    handleChats,
    activeConversation,
    handleActiveConversation,
    handleNewConversation,
  };
};

export default useChats;
