//REACT
import React, { useEffect, useState } from "react";

//THIRD-PARTY IMPORTS
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  docco,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

//icons
import Clipboard from "../../../assets/icons/clipboard-icon";
import SingleTick from "../../../assets/icons/single-tick";

//CSS
import classes from "../../../styles/csHighlighter.module.css";

const CSHighlighter = (props) => {
  //state variable
  const [copied, setCopied] = useState(false);
  const [snippet, setSnippet] = useState("");
  const [snippetLength, setSnippetLength] = useState(250);
  const [visibleSnippet, setVisibleSnippet] = useState("");

  //extracting from props
  useEffect(() => {
    setSnippet(props.snippet);
  }, [props]);

  //   const snippet = `#include <iostream>
  // using namespace std;

  // int main() {

  // int first_number, second_number, sum;

  // cout << "Enter two integers: ";
  // cin >> first_number >> second_number;

  // // sum of two numbers in stored in variable sumOfTwoNumbers
  // sum = first_number + second_number;

  // // prints sum
  // cout << first_number << " + " <<  second_number << " = " << sum;

  // return 0;
  // }
  // `;

  useEffect(() => {
    if (snippet.length > 250) {
      setVisibleSnippet(snippet.substring(0, snippetLength));
    } else {
      setVisibleSnippet(snippet);
    }
  }, [snippet, snippetLength]);

  const copyHandler = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const moreLength = snippet.length - snippetLength;

  const showMoreHandler = () => {
    if (moreLength > 0) {
      if (moreLength > 250) {
        setSnippetLength((prev) => prev + 250);
      } else {
        setSnippetLength((prev) => prev + moreLength);
      }
    }
  };

  const showLessHandler = () => {
    if (snippetLength > 250) {
      setSnippetLength(250);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes["container-header"]}>
        <div className={classes.circles}>
          <span className={`${classes["circle"]} ${classes.one}`} />
          <span className={`${classes["circle"]} ${classes.two}`} />
          <span className={`${classes["circle"]} ${classes.three}`} />
        </div>
        <span>JSX</span>
        <span
          className={`${classes.copy} ${copied ? classes.copied : ""}`}
          onClick={copyHandler}
        >
          {!copied && (
            <>
              <Clipboard />
              <span>Copy Code</span>
            </>
          )}
          {copied && (
            <>
              <SingleTick />
              <span>Copied!</span>
            </>
          )}
        </span>
      </div>
      <SyntaxHighlighter
        language="jsx"
        style={atomOneDark}
        customStyle={{ padding: "0 20px", wordWrap: "break-word" }}
        wrapLongLines={true}
      >
        {visibleSnippet}
      </SyntaxHighlighter>
      <div className={classes["container-footer"]}>
        {moreLength > 0 && <span onClick={showMoreHandler}>...more</span>}
        {moreLength <= 0 && snippet.length > 250 && (
          <span onClick={showLessHandler}>show less</span>
        )}
      </div>
    </div>
  );
};

export default CSHighlighter;
