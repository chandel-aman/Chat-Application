import React from "react";
import { Routes, Route } from "react-router-dom";

//context
import { AuthContext } from "./shared/context/auth-context";
import { ContactsContext } from "./shared/context/contacts-context";
import { ChatsContext } from "./shared/context/chats-context";
import { SocketContext } from "./shared/context/socket-context";

//hooks
import useAuth from "./shared/hooks/auth-hook";
import useContacts from "./shared/hooks/contacts-hooks";
import useChats from "./shared/hooks/chats-hooks";
import useSocket from "./shared/hooks/socket-hook";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import OTP from "./pages/auth/Otp";
import Dashboard from "./components/dashboard/Dashboad";
import CSHighlighter from "./shared/UI/codeSyntaxHighlighter/CSHighlighter";
import NoPageFound from "./shared/UI/404";

const App = () => {
  //extracting from custom hooks
  const { token, login, logout, userId, userName, phone, is2FA, twoFAHandler } =
    useAuth();

  const { contacts, handleContacts, handleNewContacts, handleNewConversation } =
    useContacts();

  const { chats, handleChats, activeConversation, handleActiveConversation } =
    useChats();

  const {
    socket,
    online,
    handleOnlineMembers,
    handleSendMessage,
    handleReceiveMessage,
    handleGettingData,
    handleEmojiReaction,
    handleReceiveReaction,
    handleTypingState,
    handleReceiveTypingState,
  } = useSocket();

  //dashboard component with context provider
  const dashboard = (
    <ContactsContext.Provider
      value={{ contacts, handleContacts, handleNewContacts }}
    >
      <ChatsContext.Provider
        value={{
          chats,
          handleChats,
          activeConversation,
          handleActiveConversation,
          handleNewConversation,
        }}
      >
        <SocketContext.Provider
          value={{
            socket,
            online,
            handleOnlineMembers,
            handleSendMessage,
            handleReceiveMessage,
            handleGettingData,
            handleEmojiReaction,
            handleReceiveReaction,
            handleTypingState,
            handleReceiveTypingState,
          }}
        >
          <Dashboard />
          {/* <CSHighlighter /> */}
        </SocketContext.Provider>
      </ChatsContext.Provider>
    </ContactsContext.Provider>
  );

  return (
    <div>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token,
          userName,
          phone,
          userId,
          login,
          logout,
          is2FA,
          twoFAHandler,
        }}
      >
        <Routes>
          {!token && (
            <>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {is2FA && <Route path="/enter-otp" element={<OTP />} />}
            </>
          )}
          {token && <Route path="/" element={dashboard} />}
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
