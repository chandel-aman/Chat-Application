import React from "react";

const AttachmentIcon = (props) => {
  return (
    <svg
    onClick={props.onClick}
      id="untitled"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
    >
      <defs>
        <filter
          id="untitled-s-path1-filter"
          x="-150%"
          width="400%"
          y="-150%"
          height="400%"
        >
          <feGaussianBlur
            id="untitled-s-path1-filter-drop-shadow-0-blur"
            in="SourceAlpha"
            stdDeviation="2,2"
          />
          <feOffset
            id="untitled-s-path1-filter-drop-shadow-0-offset"
            dx="0"
            dy="5"
            result="tmp"
          />
          <feFlood
            id="untitled-s-path1-filter-drop-shadow-0-flood"
            flood-color="rgba(0,0,0,0.2)"
          />
          <feComposite
            id="untitled-s-path1-filter-drop-shadow-0-composite"
            operator="in"
            in2="tmp"
          />
          <feMerge id="untitled-s-path1-filter-drop-shadow-0-merge">
            <feMergeNode id="untitled-s-path1-filter-drop-shadow-0-merge-node-1" />
            <feMergeNode
              id="untitled-s-path1-filter-drop-shadow-0-merge-node-2"
              in="SourceGraphic"
            />
          </feMerge>
        </filter>
      </defs>
      <g
        id="untitled-s-g1"
        transform="matrix(1.423535 0 0 1.406592-44.517099-98.970369)"
      >
        <path
          id="untitled-s-path1"
          d="M140.000001,255.466053c-31.735057,1.452147-63.012624-34.171437-60.339471-55.357675l.339471-73.23841c26.712311-49.136233,89.285098-45.893288,120,0v73.23841c-15.931263,33.16268-45.407417,25.828834-60,0v-40.442095"
          transform="translate(.000001 0)"
          filter="url(#untitled-s-path1-filter)"
          fill="none"
          stroke="#afafaf"
          stroke-width="24"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

export default AttachmentIcon;
