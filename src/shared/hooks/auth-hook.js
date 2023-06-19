import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PREFIX = "Whatsapp-clone-";

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState(null);
  const [is2FA, setIs2FA] = useState(false);
  // const [userEmail, setUserEmail] = userState(null);

  const navigate = useNavigate();

  const login = useCallback((uid, token, username, phone, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setUserName(username);
    setPhone(phone);
    setIsLoggedIn(true);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationTime(tokenExpirationDate);
    localStorage.setItem(
      `${PREFIX}userData`,
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
        username: username,
        phone: phone,
      })
    );
    navigate("/");
  }, []);

  //logout function
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationTime(null);
    setIsLoggedIn(false);
    setPhone(null);
    localStorage.removeItem(`${PREFIX}userData`);
    navigate("/login");
  }, []);

  //to auto logout the user after the token expires
  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
      // setIsLoggedIn(false);
    }
  }, [token, logout, tokenExpirationTime]);

  //to store the user data and auto login the user
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(`${PREFIX}userData`));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.username,
        storedData.phone,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  const twoFAHandler = (value) => {
    setIs2FA(value);
  };

  return {
    token,
    login,
    logout,
    userId,
    userName,
    phone,
    is2FA,
    twoFAHandler
  };
};

export default useAuth;
