import React from "react";
import { useSpring, animated } from "@react-spring/web";
import classes from "../../styles/blob.module.css";

const Blob = () => {
  const animationProps = useSpring({
    from: {
      d: "M439.5,293.5Q385,337,361,389Q337,441,280.5,436Q224,431,183,403Q142,375,76,347.5Q10,320,38,258Q66,196,106,163Q146,130,180.5,67.5Q215,5,278.5,26.5Q342,48,363,106Q384,164,439,207Q494,250,439.5,293.5Z",
    },
    to: {
      d: "M453,309.5Q435,369,386,404.5Q337,440,280.5,434Q224,428,168,418.5Q112,409,109,350.5Q106,292,89.5,245Q73,198,93.5,145.5Q114,93,164.5,50.5Q215,8,272.5,41Q330,74,371,110Q412,146,441.5,198Q471,250,453,309.5Z",
    },
    config: { duration: 10000 },
    loop: { reverse: true },
  });
  return (
    <>
      <div className={classes["blob"]}>
        <svg
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          id="blobSvg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgb(238, 205, 163)" }} />
              <stop offset="100%" style={{ stopColor: "rgb(239, 98, 159)" }} />
            </linearGradient>
          </defs>
          <animated.path fill="url(#gradient)" d={animationProps.d} />
        </svg>
      </div>
      <div className={classes["blob"]}>
        <svg
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          id="blobSvg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgb(76, 161, 175)" }} />
              <stop offset="100%" style={{ stopColor: "rgb(196, 224, 229)" }} />
            </linearGradient>
          </defs>
          <animated.path fill="url(#gradient)" d={animationProps.d} />
        </svg>
      </div>
    </>
  );
};

export default Blob;

// values="
// M439.5,293.5Q385,337,361,389Q337,441,280.5,436Q224,431,183,403Q142,375,76,347.5Q10,320,38,258Q66,196,106,163Q146,130,180.5,67.5Q215,5,278.5,26.5Q342,48,363,106Q384,164,439,207Q494,250,439.5,293.5Z

// M421,305.5Q423,361,387,416.5Q351,472,287,453Q223,434,173,415.5Q123,397,79.5,355Q36,313,35.5,250Q35,187,70.5,135.5Q106,84,166.5,85.5Q227,87,283,71Q339,55,383,95.5Q427,136,423,193Q419,250,421,305.5Z

// M452,309.5Q435,369,390,413.5Q345,458,286.5,429Q228,400,180.5,392.5Q133,385,84,349Q35,313,46.5,253.5Q58,194,92.5,151Q127,108,174,80Q221,52,284,44.5Q347,37,363,102Q379,167,424,208.5Q469,250,452,309.5Z

// M444.5,298Q400,346,369,394.5Q338,443,281.5,434Q225,425,173,412Q121,399,72.5,357.5Q24,316,20,248.5Q16,181,55.5,126Q95,71,156,46Q217,21,273,49.5Q329,78,385.5,102.5Q442,127,465.5,188.5Q489,250,444.5,298Z

// M453,309.5Q435,369,386,404.5Q337,440,280.5,434Q224,428,168,418.5Q112,409,109,350.5Q106,292,89.5,245Q73,198,93.5,145.5Q114,93,164.5,50.5Q215,8,272.5,41Q330,74,371,110Q412,146,441.5,198Q471,250,453,309.5Z
// "
