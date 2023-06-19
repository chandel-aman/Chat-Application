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
import { ToastContainer, toast } from "react-toastify";

//assets
import Blob from "../../assets/animation/Blob";
import Loader from "../../assets/animation/Loader";

//CSS
import classes from "../../styles/authPage.module.css";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  email: "",
  password: "",
};

const LoginSchema = Yup.object().shape({
  password: Yup.string().min(8, "Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  //state variable
  const [showPassword, setShowPassword] = useState(false);

  const { sendRequest, isLoading } = useHttpClient();

  const errorStyles = {
    color: "red",
    fontSize: "12px",
    textAlign: "centre",
  };
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
      {!isLoading && <Blob />}
      {isLoading && <Loader />}
      {!isLoading && (
        <div className={classes.container}>
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              try {
                const responseData = await sendRequest(
                  "http://localhost:8000/api/user/login",
                  "POST",
                  JSON.stringify(values),
                  { "Content-Type": "application/json" }
                );
                if (responseData.is2FA) {
                  authCtx.twoFAHandler(true);
                  toast.info("OTP has been send to your email!");
                  navigate("/enter-otp", {
                    state: { email: responseData.email },
                  });
                } else {
                  const { userId, token, username, phone } = await responseData;
                  authCtx.login(userId, token, username, phone);
                  console.log(username + " logged in!");
                }
              } catch (error) {
                console.log(error.message);
                toast.error(error.message);
              }
            }}
          >
            {(isSubmitting) => (
              <div className={classes["inner-container"]}>
                <h1>Login</h1>
                <Form className={classes.form}>
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
                  <button type="submit">Login</button>
                </Form>
                <p onClick={() => navigate("/signup")}>or sign up</p>
              </div>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default Login;
