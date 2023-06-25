//react
import React, { useContext, useState } from "react";

//context
import { AuthContext } from "../../shared/context/auth-context";
import { ContactsContext } from "../../shared/context/contacts-context";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";

//third-party imports
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";

//css
import classes from "../../styles/warningModal.module.css";

const initialValues = {
  password: "",
};

//validation schema for yup object
const passwordSchemaYup = Yup.object().shape({
  password: Yup.string().min(8, "Too Short!").required("Required"),
});

//custom error styles for the form input errors
const errorStyles = {
  color: "red",
  fontSize: "12px",
  textAlign: "centre",
};

//new contact form
const WarningModal = (props) => {
  //state variable
  const [showPassword, setShowPassword] = useState(false);
  //http request
  const { sendRequest, isLoading } = useHttpClient();

  //context
  const ctx = useContext(AuthContext);
  const { handleNewContacts } = useContext(ContactsContext);

  //extracting the props
  const { setShowModal } = props;

  //rendering
  return (
    <>
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
      <div className={classes["warningModal-container"]}>
        <Formik
          initialValues={initialValues}
          validationSchema={passwordSchemaYup}
          onSubmit={async (values) => {
            console.log(values);
            // try {
            //   const responseData = await sendRequest(
            //     `${process.env.REACT_APP_BACKEND_URL}/api/user/${ctx.userId}/add-new-contact`,
            //     "POST",
            //     JSON.stringify(values),
            //     { "Content-Type": "application/json" }
            //   );
            //   console.log(responseData);
            //   if (!isLoading) {
            //     setShowModal(false);
            //   }
            //   handleNewContacts(responseData.contacts);
            //   toast.success(responseData.message);
            // } catch (error) {
            //   console.log(error);
            //   toast.error(error.message);
            // }
          }}
        >
          {(isSubmitting) => (
            <div className={classes["warningModal-innerContainer"]}>
              <h2 className={classes["warningModal-header"]}>
                Verify your password
              </h2>
              <Form className={classes["warningModal-form"]}>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                />
                <span className={classes.checkbox}>
                  <Field
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                  <span>show password</span>
                </span>

                <ErrorMessage
                  name="password"
                  component="div"
                  style={errorStyles}
                />
                <div className={classes["warningModal-buttons"]}>
                  <button data="cancel" onClick={() => setShowModal()}>
                    Cancel
                  </button>
                  <button data="ok" type="submit">
                    Proceed
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WarningModal;
