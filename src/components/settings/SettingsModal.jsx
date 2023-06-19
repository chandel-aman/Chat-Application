//react
import { useState, useEffect } from "react";

//components
import GeneralSettings from "./GeneralSettings";
import AccountSettings from "./AccountSettings";

//css
import classes from "../../styles/settings-modal.module.css";

//icons
import GeneralSettingsIcon from "../../assets/icons/general-settings-icon";
import KeyIcon from "../../assets/icons/key-icon";
import BrushIcon from "../../assets/icons/brush-icon";
import HelpCircleIcon from "../../assets/icons/helpCircle-icon";
import UserIcon from "../../assets/icons/user-icon";

const MENU_LIST = [
  {
    icon: <GeneralSettingsIcon />,
    text: "General",
  },
  {
    icon: <KeyIcon />,
    text: "Account",
  },
  {
    icon: <BrushIcon />,
    text: "Personalization",
  },
  {
    icon: <HelpCircleIcon />,
    text: "Help",
  },
  {
    icon: <UserIcon />,
    text: "Profile",
  },
];

const MENU_LIST_DETAILS = [<GeneralSettings />, <AccountSettings />];

const SettingsModal = (props) => {
  const [activeSettings, setActiveSettings] = useState(0);

  const activeSettingsChangeHandler = (index) => {
    setActiveSettings(index);
  };

  useEffect(() => {
    if (props.isProfileClicked) {
      const index = MENU_LIST.length - 1;
      setActiveSettings(index);
    } else {
      setActiveSettings(0);
    }
  }, [props.isProfileClicked]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!props.show || !props.isProfileClicked) {
        setActiveSettings(0);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [props.show, props.isProfileClicked]);

  return (
    <div
      className={`${classes["settings-container"]} ${
        props.show || props.isProfileClicked ? classes.show : ""
      }`}
    >
      <section className={classes["settings-menu"]}>
        <ul className={classes["settings-menu-list"]}>
          {MENU_LIST.map((item, index) => (
            <li
              key={index}
              className={`${classes["settings-menu-list-item"]} ${
                activeSettings === index ? classes.active : ""
              } ${item.text === "Profile" ? classes.profile : ""}`}
              onClick={() => activeSettingsChangeHandler(index)}
            >
              {item.icon}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={classes["settings-details"]}>
        {MENU_LIST_DETAILS[activeSettings]}
      </section>
    </div>
  );
};

export default SettingsModal;
