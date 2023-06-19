//react
import { createContext } from "react";

//creating a context for contacts
export const ContactsContext = createContext({
  contacts: [],
  handleContacts: () => {},
  handleNewContacts: () => {},
});
