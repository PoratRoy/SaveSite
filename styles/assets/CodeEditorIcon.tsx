
import React from "react";

const CodeEditorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 5V7H19V5H5ZM7.29289 10.2929L3.58579 14L7.29289 17.7071L8.70711 16.2929L6.41421 14L8.70711 11.7071L7.29289 10.2929ZM16.7071 10.2929L15.2929 11.7071L17.5858 14L15.2929 16.2929L16.7071 17.7071L20.4142 14L16.7071 10.2929ZM12.5 10L10.5 18H12L14 10H12.5Z" />
    </svg>
  );
};

export default CodeEditorIcon;
