
import React from "react";

const OpenFolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M3 5C3 3.89543 3.89543 3 5 3H9.58579L11.5858 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 7V19H19V9H10.4142L8.41421 7H5Z" />
    </svg>
  );
};

export default OpenFolderIcon;
