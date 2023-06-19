//react
import { useState, useEffect } from "react";

//third party libraries
import { Formik, Form, Field } from "formik";

//ui elements
import { Modal } from "@mui/material";

//css
import classes from "../../styles/accountSettings.module.css";
import WarningModal from "./WarningModal";

const AccountSettings = (props) => {
  //state variable
  const [twoFactor, setTwoFactor] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  const handle2FAToggle = () => {
    //show a warning
    setShowWarning(true);
    setTwoFactor((prev) => !prev);
  };

  //sending request to the server
  useEffect(() => {}, [twoFactor]);

  return (
    <>
      {showWarning && (
        <Modal show={showWarning} onCancel={() => setShowWarning(false)}>
          <div className={classes["warning-container"]}>
            {/* <WarningModal /> */}
            <h1>Hello there</h1>
          </div>
        </Modal>
      )}
      <div className={classes["account-settings-container"]}>
        <h1>Account</h1>
        <h2>Two-Factor Authentication</h2>
        <Formik>
          {() => (
            <Form className={classes["as-form"]}>
              <Field
                className={`${classes["as-form-input"]} ${
                  twoFactor ? classes.true : ""
                }`}
                type="checkbox"
                id="2FA"
                name="2FA"
                value={twoFactor}
                onChange={handle2FAToggle}
              />
              <span
                className={`${classes["as-form-input-text"]} ${
                  twoFactor ? classes.true : ""
                }`}
              >
                {twoFactor ? "On" : "Off"}
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AccountSettings;
