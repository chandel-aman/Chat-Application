//react
import React, { useContext, useState } from "react";
//react-router
import { useNavigate } from "react-router";
//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";
//context
import { AuthContext } from "../../shared/context/auth-context";
//third party libraries
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

//assets
import Blob from "../../assets/animation/Blob";

//CSS
import classes from "../../styles/authPage.module.css";

const initialValues = {
  username: "",
  phone: null,
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .required("Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: Yup.string()
    .min(8, "Too Short!")
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  phone: Yup.number()
    .integer("Must be an integer!")
    .min(100000000, "Must of of 10 digits")
    .max(9999999999, "Must be of 10 digits")
    .required("Required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  //state variable
  const [showPassword, setShowPassword] = useState(false);

  const { sendRequest, isLoading } = useHttpClient();

  const errorStyles = {
    color: "red",
    fontSize: "12px",
    textAlign: "centre",
    position: "relative",
  };
  return (
    <>
      {!isLoading && <Blob />}

      {!isLoading && (
        <div className={classes.container}>
          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              console.log(values);
              try {
                const responseData = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/api/user/signup`,
                  "POST",
                  JSON.stringify(values),
                  { "Content-Type": "application/json" }
                );
                const { userId, token, username, phone } = await responseData;
                console.log(username + " created!");
                authCtx.login(userId, token, username, phone);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {(isSubmitting) => (
              <div className={classes["inner-container"]}>
                <h1>Sign Up</h1>
                <Form className={classes.form}>
                  <Field type="text" name="username" placeholder="Username" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    style={errorStyles}
                  />
                  <Field type="tel" name="phone" placeholder="Phone" />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    style={errorStyles}
                  />
                  <Field type="text" name="email" placeholder="Email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={errorStyles}
                  />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={errorStyles}
                  />
                  <Field
                    type="text"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={errorStyles}
                  />
                  <span className={classes.checkbox}>
                    <Field
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <span>show password</span>
                  </span>
                  <button type="submit">Sign Up</button>
                </Form>
                <p onClick={() => navigate("/login")}>or login</p>
              </div>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default SignUp;
