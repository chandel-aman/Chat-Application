//react
import { createContext } from "react";

//creating a context for contacts
export const ChatsContext = createContext({
  // chats: [{ chatName: "", messages: [], recipients: [] }],
  chats: [],
  handleChats: () => {},
  handleNewConversation: () => {},
  activeConversation: null,
  handleOpenConversation: () => {},
});
