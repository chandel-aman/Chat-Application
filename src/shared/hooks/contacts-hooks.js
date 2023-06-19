//React
import { useCallback, useState } from "react";

//custom hook to use the contacts stored in the context
const useContacts = () => {
  //state variables
  const [contacts, setContacts] = useState([]);

  //function to handle contacts
  const handleContacts = useCallback((arrayOfContacts) => {
    setContacts(arrayOfContacts);
  });

  //function to add new contacts
  const handleNewContacts = useCallback((newContact) =>
    setContacts((prev) => [...prev, newContact])
  );

  return { contacts, handleContacts, handleNewContacts };
};

export default useContacts;
