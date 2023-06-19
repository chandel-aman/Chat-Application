import React from "react";

const AudioWaveIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      width="512"
      height="512"
    >
      <linearGradient id="fill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3c1d63" />
        <stop offset="100%" stop-color="#4e38a2" />
      </linearGradient>

      <path
        fill="url(#fill)"
        d="m18,8.5v7c0,.828-.672,1.5-1.5,1.5s-1.5-.672-1.5-1.5v-7c0-.828.672-1.5,1.5-1.5s1.5.672,1.5,1.5ZM11.5,0c-.828,0-1.5.672-1.5,1.5v21c0,.828.672,1.5,1.5,1.5s1.5-.672,1.5-1.5V1.5c0-.828-.672-1.5-1.5-1.5Zm10,4c-.828,0-1.5.672-1.5,1.5v13c0,.828.672,1.5,1.5,1.5s1.5-.672,1.5-1.5V5.5c0-.828-.672-1.5-1.5-1.5Zm-15,1c-.828,0-1.5.672-1.5,1.5v11c0,.828.672,1.5,1.5,1.5s1.5-.672,1.5-1.5V6.5c0-.828-.672-1.5-1.5-1.5ZM1.5,9c-.828,0-1.5.672-1.5,1.5v3c0,.828.672,1.5,1.5,1.5s1.5-.672,1.5-1.5v-3c0-.828-.672-1.5-1.5-1.5Z"
      />
    </svg>
  );
};

export default AudioWaveIcon;
