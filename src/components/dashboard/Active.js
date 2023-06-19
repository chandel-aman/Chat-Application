import React from "react";

//custom components
import Chats from "./Chats";
import Contacts from "./Contacts";

//css
import classes from "../../styles/active.module.css";

const Active = (props) => {
  const { activeTab } = props;

  //rendering
  return (
    <div className={classes.activeTab}>
      {activeTab === "chats" && <Chats />}
      {activeTab === "contacts" && <Contacts contacts={props.contacts} />}
    </div>
  );
};

export default Active;
