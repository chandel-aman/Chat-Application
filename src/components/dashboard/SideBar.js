//react
import React, { useState } from "react";

//UI
import Backdrop from "../../shared/UI/Backdrop";
import SettingsModal from "../settings/SettingsModal";

//css
import classes from "../../styles/sidebar.module.css";

//images
import profileImage from "../../assets/images/profile-image.jpg";

//icons
import ChatIcon from "../../assets/icons/chat-icon";
import ContactIcon from "../../assets/icons/contact-icon";
import Setting from "../../assets/icons/setting-icon";

const SideBar = (props) => {
  //state variable
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [profileClick, setProfileClick] = useState(false);

  const { activeTab, setActiveTab } = props;

  const profileClickHandler = () => {
    setShowSettingsModal(true);
    setProfileClick(true);
  };
  return (
    <>
      {showSettingsModal && (
        <Backdrop
          onClick={() => {
            setShowSettingsModal(false);
            setProfileClick(false);
          }}
          style={{ "background-color": "transparent" }}
        />
      )}
      <div className={classes.sidebar}>
        <div>
          <div className={classes.profile} onClick={profileClickHandler}>
            <img src={profileImage} alt="desktop-profile" />
          </div>
          <nav>
            <div
              onClick={() =>
                setActiveTab((prev) => (prev === "chats" ? "close" : "chats"))
              }
              className={`${classes.icons} ${classes.chat} ${
                activeTab === "chats" ? classes.active : ""
              }`}
            >
              <ChatIcon />
            </div>
            <div
              onClick={() =>
                setActiveTab((prev) =>
                  prev === "contacts" ? "close" : "contacts"
                )
              }
              className={`${classes.icons} ${classes.contact} ${
                activeTab === "contacts" ? classes.active : ""
              }`}
            >
              <ContactIcon />
            </div>
          </nav>
        </div>
        <div
          className={`${classes.icons} ${classes.settings}`}
          onClick={() => setShowSettingsModal(true)}
        >
          <Setting />
        </div>
      </div>
      <SettingsModal show={showSettingsModal} isProfileClicked={profileClick} />
    </>
  );
};

export default SideBar;
