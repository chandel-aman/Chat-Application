//react
import { createContext } from "react";

//creating a context for contacts
export const SocketContext = createContext({
  socket: null,
  online: [],
  handleSendMessage: () => {},
  handleReceiveMessage: () => {},
  handleGettingData: () => {},
  handleTypingState: () => {},
  handleReceiveTypingState: () => {},
});
