import React, { useContext, useEffect, useState } from "react";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";

//context
import { AuthContext } from "../../shared/context/auth-context";
import { ContactsContext } from "../../shared/context/contacts-context";
import { ChatsContext } from "../../shared/context/chats-context";
import { SocketContext } from "../../shared/context/socket-context";

//custom components
import Active from "./Active";
import Main from "./Main";
import SideBar from "./SideBar";

//assets
import Loader from "../../assets/animation/Loader";

//CSS
import classes from "../../styles/dashboard.module.css";

const Dashboard = (props) => {
  //state variables
  const [activeTab, setActiveTab] = useState("chats");

  //http
  const { sendRequest, isLoading } = useHttpClient();

  //context
  const ctx = useContext(AuthContext);
  const contactsCtx = useContext(ContactsContext);
  const { chats, handleChats } = useContext(ChatsContext);
  const { handleGettingData } = useContext(SocketContext);

  //fetching the user data when the component gets rendered
  useEffect(() => {
    const fetchContacts = async () => {
      if (ctx.userId)
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/api/user/${ctx.userId}/get-contacts`
          );
          // console.log(responseData.contacts);
          contactsCtx.handleContacts(responseData.contacts);
        } catch (error) {
          console.log(error);
        }
    };
    fetchContacts();
  }, [ctx.userId]);

  useEffect(() => {
    const fetchChats = async () => {
      if (ctx.userId)
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/api/user/${ctx.userId}/chats`
          );
          // console.log(responseData.chats);
          handleChats(responseData.chats);
        } catch (error) {
          console.log(error);
        }
    };
    fetchChats();
  }, [ctx.userId]);

  //sending data to socket hook
  useEffect(() => {
    if (ctx.userId && chats) {
      handleGettingData(ctx.userId, chats);
    }
  }, [ctx.userId, chats]);

  //active tab handler
  const handleActiveTab = (value) => {
    setActiveTab(value);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={classes.dashboard}>
        <div
          className={`${classes["sidebar-active"]} ${
            activeTab !== "close" ? classes.slide : ""
          }`}
        >
          <SideBar activeTab={activeTab} setActiveTab={handleActiveTab} />
          <Active activeTab={activeTab} />
        </div>
        <Main />
      </div>
    </>
  );
};

export default Dashboard;
