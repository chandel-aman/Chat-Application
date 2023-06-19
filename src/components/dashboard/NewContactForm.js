//react
import React, { useContext } from "react";
import { useNavigate } from "react-router";

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
import classes from "../../styles/newContactForm.module.css";

//assets
import Loader from "../../assets/animation/Loader";

//initial values for the form
const initialValues = {
  name: "",
  phone: null,
};

//validation schema for yup object
const newContactSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too Short!").required("Required"),
  phone: Yup.number()
    .integer()
    .min(1000000000, "Should be of 10 digits.")
    .max(9999999999, "Should be of 10 digits.")
    .required("Required"),
});

//custom error styles for the form input errors
const errorStyles = {
  color: "red",
  fontSize: "12px",
  textAlign: "centre",
};

//new contact form
const NewContactForm = (props) => {
  //http request
  const { sendRequest, isLoading } = useHttpClient();

  //context
  const ctx = useContext(AuthContext);
  const { handleNewContacts } = useContext(ContactsContext);

  //navigation
  const navigate = useNavigate();

  //extracting the props
  const { setShowModal } = props;

  //rendering
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
      <div className={classes["newContact-container"]}>
        <Formik
          initialValues={initialValues}
          validationSchema={newContactSchema}
          onSubmit={async (values) => {
            try {
              const responseData = await sendRequest(
                `http://localhost:8000/api/user/${ctx.userId}/add-new-contact`,
                "POST",
                JSON.stringify(values),
                { "Content-Type": "application/json" }
              );
              console.log(responseData);
              if (!isLoading) {
                setShowModal(false);
              }
              handleNewContacts(responseData.contacts);
              toast.success(responseData.message);
            } catch (error) {
              console.log(error);
              toast.error(error.message);
            }
          }}
        >
          {(isSubmitting) => (
            <div className={classes["newContact-innerContainer"]}>
              <h2 className={classes["newContact-header"]}>Add New Contact</h2>
              <Form className={classes["newContact-form"]}>
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" placeholder="Sam" />
                <ErrorMessage name="name" component="div" style={errorStyles} />
                <label htmlFor="contact-number">Contact Number</label>
                <Field type="number" name="phone" placeholder="9876543210" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  style={errorStyles}
                />
                <div className={classes["newContact-buttons"]}>
                  <button data="cancel" onClick={() => setShowModal()}>
                    Cancel
                  </button>
                  <button data="ok" type="submit">
                    Add
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

export default NewContactForm;
