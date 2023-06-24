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
