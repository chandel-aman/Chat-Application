import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userName: "",
  phone: null,
  // userImage: null,
  userId: null,
  login: () => {},
  logout: () => {},
  is2FA: false,
  twoFAHandler: ()=>{}
});
