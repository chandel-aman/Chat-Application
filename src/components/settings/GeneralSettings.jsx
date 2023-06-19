//react
import { useState } from "react";

//custom hook
import useAuth from "../../shared/hooks/auth-hook";

//third party libraries
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

//css
import classes from "../../styles/generalSettings.module.css";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  language: Yup.string().required("Language is required"),
});

// Define the initial values
const initialValues = {
  language: "english",
};

// Available language options
const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  // Add more options as needed
];

const GeneralSettings = (props) => {
  //state variable
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialValues.language
  );

  //destructuring from the useAuth hook
  const { logout } = useAuth();

  const handleLanguageChange = (selectedValue) => {
    setSelectedLanguage(selectedValue);
    // setShowModal(true);
  };

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className={classes["general-settings-container"]}>
      <h1>General</h1>
      <h2>Language</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {() => (
          <Form className={classes["gs-form"]}>
            <Field
              as="select"
              id="language"
              name="language"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="language" component="div" className="error" />
          </Form>
        )}
      </Formik>
      <hr />
      <button className={classes["gs-logout-btn"]} onClick={logoutHandler}>
        Log out
      </button>
    </div>
  );
};

export default GeneralSettings;
