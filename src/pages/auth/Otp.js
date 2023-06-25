//react
import React, { useContext, useState } from "react";

//react-router
import { useLocation, useNavigate } from "react-router";

//custom hooks
import { useHttpClient } from "../../shared/hooks/http-hook";

//context
import { AuthContext } from "../../shared/context/auth-context";

//third party libraries
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import OtpInput from "react-otp-input";

//assets
import Blob from "../../assets/animation/Blob";
import Loader from "../../assets/animation/Loader";

//CSS
import classes from "../../styles/authPage.module.css";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  otp: "",
};

const LoginSchema = Yup.object().shape({
  otp: Yup.number().min(6, "Too Short!").required("Required"),
});

const OTP = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  //state variable
  const [otp, setOtp] = useState();

  const { sendRequest, isLoading } = useHttpClient();

  const { state } = useLocation();

  const otpSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(otp, state.email);
    const values = {
      email: state.email,
      otp: otp,
    };
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login/verify-otp`,
        "POST",
        JSON.stringify(values),
        { "Content-Type": "application/json" }
      );
      const { userId, token, username, phone } = await responseData;
      authCtx.login(userId, token, username, phone);
      console.log(username + " logged in!");
      toast("Logged in as", username);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
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
          <div className={classes["inner-container"]}>
            <h1>Enter OTP</h1>
            <form className={classes.form} onSubmit={otpSubmitHandler}>
              <div className={classes["otp-input"]}>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>&nbsp;</span>}
                  shouldAutoFocus={true}
                  renderInput={(props) => <input {...props} name="otp" />}
                />
              </div>

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OTP;
