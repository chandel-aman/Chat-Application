//react
import React, { useEffect, useState, useContext } from "react";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useActiveConversation } from "../../shared/hooks/activeConversation-hook";

//context
import { AuthContext } from "../../shared/context/auth-context";
import { ChatsContext } from "../../shared/context/chats-context";

//third party imports
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";

//custom components
import Modal from "../../shared/UI/Modal";

//icons
import BackIcon from "../../assets/icons/back-icon";

//css
import classes from "../../styles/newGroup.module.css";

//UI
import Loader from "../../assets/animation/Loader";

const NewGroup = (props) => {
  //state variables
  const [members, setMembers] = useState([]);
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [nextClicked, setNextClicked] = useState(false);
  const [groupSubject, setGroupSubject] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [alert, setAlert] = useState("");
  const [response, setResponse] = useState();

  //extracting the props
  const { contacts, setShowModal } = props;

  //extracting from http client
  const { sendRequest, isLoading } = useHttpClient();

  //extracting from active conversation hook
  const { openConversationHandler } = useActiveConversation();

  //extracting from auth context
  const { userId, phone } = useContext(AuthContext);

  //extracting from chats context
  const { handleNewConversation } = useContext(ChatsContext);

  //useEffect
  useEffect(() => {
    if (checkedOptions.length > 0) {
      console.log(checkedOptions);
    }
  }, [checkedOptions]);

  //useEffect to set the new conversation
  useEffect(() => {
    if (response) {
      //adding the group as a new conversation
      handleNewConversation(response);

      //opening the group conversation
      openConversationHandler(response._id);
    }
  }, [response]);

  const handleCheckboxChange = (event) => {
    const { value } = event.target;

    if (checkedOptions.includes(value)) {
      setCheckedOptions(checkedOptions.filter((option) => option !== value));
    } else {
      setCheckedOptions([...checkedOptions, value]);
    }
  };

  //function to handle the next button click
  const handleNextClick = () => {
    setNextClicked(true);
    setMembers(checkedOptions);
  };

  //function to handle alert on cancel
  // const handleAlert = (alertMessage) => {
  //   setAlert(alertMessage);
  // };

  //function to handle model cancel
  const handleCancel = () => {
    setCheckedOptions([]);
    setShowModal();
    setGroupSubject("");
    setShowWarningModal(false);
    setAlert("");
  };

  //function to handle change in group subject
  const groupSubjectHandler = (event) => {
    setGroupSubject(event.target.value);
  };

  //function to set the members to be include in a group
  const createGroupHandler = async ({ participants, name }) => {
    const groupData = { participants, name };
    groupData.participants.push(phone.toString());
    console.log(groupData);
    if (groupData)
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/chats/${userId}/createGroup`,
          "POST",
          JSON.stringify(groupData),
          { "Content-Type": "application/json" }
        );
        console.log(responseData);
        //if the response is received successfully then close the modal
        handleCancel();

        setResponse(responseData.newConversation);
        toast.success(responseData.message);
      } catch (error) {
        console.log(
          "Error occured in sending the group creation request to the server.",
          error
        );
        toast.error(error.message);
      }
  };
  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className={classes["newgroup-container"]}>
        {/* <Modal
        show={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
      >
        <div>
          {alert === "error" && (
            <>
              <h3>To continue, provide a group subject.</h3>
              <button type="button" onClick={() => setShowWarningModal(false)}>
                Ok
              </button>
            </>
          )}
          {alert === "warning" && (
            <>
              <h3>Cancel creating group?</h3>
              <p>
                Your group participants, subject and icon will not be saved.
              </p>
              <button onClick={handleCancel}>Yes, cancel</button>
              <button onClick={() => setShowWarningModal(false)}>
                Go back
              </button>
            </>
          )}
        </div>
      </Modal> */}
        <span className={classes["newgroup-header"]}>
          <span
            className={classes["newgroup-backIcon"]}
            onClick={() => setShowModal()}
          >
            <BackIcon />
          </span>
          <h3>New Group</h3>
        </span>
        <Formik
          initialValues={{
            checked: checkedOptions,
            subject: groupSubject,
          }}
          onSubmit={async () => {
            createGroupHandler({ participants: members, name: groupSubject });
          }}
        >
          {({ values }) => (
            <Form>
              {checkedOptions.length > 0 && !nextClicked && (
                <div className={classes["newgroup-actionBtns"]}>
                  <button type="button" onClick={handleNextClick} data="ok">
                    Next
                  </button>
                  <button type="button" onClick={handleCancel} data="cancel">
                    Cancel
                  </button>
                </div>
              )}
              <h5>All Contacts</h5>
              {!nextClicked && (
                <div
                  role="group"
                  aria-labelledby="checkbox-group"
                  className={classes["newgroup-contactList"]}
                >
                  {contacts &&
                    contacts.map((contact) => (
                      <div
                        className={`${classes["newgroup-contact"]} ${
                          checkedOptions.includes(`${contact.phone}`)
                            ? classes.selected
                            : ""
                        }`}
                        key={`${contact.username}_${contact.phone}`}
                      >
                        {contact.username}
                        <Field
                          type="checkbox"
                          name="checked"
                          value={`${contact.phone}`}
                          onChange={handleCheckboxChange}
                          checked={checkedOptions.includes(`${contact.phone}`)}
                        />
                      </div>
                    ))}
                </div>
              )}
              {nextClicked && (
                <div
                  role="group-subject"
                  className={classes["newgroup-groupInfo"]}
                >
                  <label>Provide a group subject</label>
                  <Field
                    type="text"
                    name="subject"
                    value={groupSubject}
                    onChange={groupSubjectHandler}
                  />
                  <div className={classes["newgroup-actionBtns"]}>
                    <button type="submit" data="ok">
                      Create
                    </button>
                    <button onClick={handleCancel} type="button" data="cancel">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default NewGroup;
