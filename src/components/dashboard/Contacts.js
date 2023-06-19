//react
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useActiveConversation } from "../../shared/hooks/activeConversation-hook";

//context
import { AuthContext } from "../../shared/context/auth-context";
import { ContactsContext } from "../../shared/context/contacts-context";
import { ChatsContext } from "../../shared/context/chats-context";

//react components
import Modal from "../../shared/UI/Modal";
import NewContactForm from "./NewContactForm";
import NewGroup from "./NewGroup";
import Backdrop from "../../shared/UI/Backdrop";

//css
import classes from "../../styles/contacts.module.css";

//icons
import AddUser from "../../assets/icons/addUser-icon";
import Edit from "../../assets/icons/edit-icon";
import AddGroup from "../../assets/icons/group-icon";

//contacts component
const Contacts = (props) => {
  //state variables
  const [createNewGroup, setCreateNewGroup] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);

  //extracting from http hook
  const { sendRequest, isLoading } = useHttpClient();

  //extracting from active conversation hook
  const { openConversationHandler } = useActiveConversation();

  //context
  const ctx = useContext(AuthContext);
  const { contacts } = useContext(ContactsContext);
  // const { chats, handleActiveConversation } = useContext(ChatsContext);

  //navigation
  const navigate = useNavigate();

  //function to handle modal toggle
  const closeCreateNewGroupHandler = () => {
    setCreateNewGroup(false);
  };

  //function to handle new contact addition
  const newContactModalHandler = () => {
    setShowEditModel(false);
    setShowNewContactModal(true);
  };

  //function to handle new group addition
  const createNewGroupHandler = () => {
    setCreateNewGroup(true);
  };

  //function to handle opening of a conversation on click
  // const openConversationHandler = (phone) => {
  //   console.log(phone);
  //   let chatId = null;
  //   chats.forEach((chat) => {
  //     if (chat.recipients.includes(phone)) {
  //       chatId = chat._id;
  //       return;
  //     }
  //   });
  //   if (chatId !== null) {
  //     handleActiveConversation(chatId);
  //     // console.log(chatId);
  //   }
  // };

  const editModelHandler = () => {
    setShowEditModel((prev) => !prev);
  };

  return (
    <div className={classes["contact-container"]}>
      {showEditModel && (
        <Backdrop
          onClick={() => setShowEditModel(false)}
          style={{ "background-color": "transparent" }}
        />
      )}
      <Modal
        show={showNewContactModal}
        onCancel={() => setShowNewContactModal(false)}
      >
        {showNewContactModal && (
          <NewContactForm setShowModal={() => setShowNewContactModal(false)} />
        )}
      </Modal>
      <div className={classes["contact-header"]}>
        <h3>Contacts</h3>
        <span
          className={`${classes.edit} ${showEditModel ? classes.active : ""}`}
          onClick={editModelHandler}
        >
          <Edit />
        </span>
      </div>

      <div
        className={`${classes["edit-model"]} ${
          showEditModel ? classes.show : ""
        }`}
      >
        <div className={classes["edit-model_content"]}>
          {!createNewGroup && (
            <ul>
              <li className={classes.addgroup} onClick={createNewGroupHandler}>
                <span>
                  <AddGroup />
                </span>
                <span>New Group</span>
              </li>
              <li
                className={classes.addContact}
                onClick={newContactModalHandler}
              >
                <span>
                  <AddUser />
                </span>
                <span>New Contact</span>
              </li>
            </ul>
          )}
          {createNewGroup && (
            <NewGroup
              contacts={contacts}
              setShowModal={closeCreateNewGroupHandler}
            />
          )}
        </div>
      </div>

      <hr />
      <ul>
        {contacts &&
          contacts.map((contact) => (
            <li
              key={contact.phone}
              onClick={() => openConversationHandler(contact.phone)}
            >
              {contact.username}
            </li>
          ))}
        {contacts && contacts.length === 0 && "No Contacts"}
      </ul>
    </div>
  );
};

export default Contacts;
