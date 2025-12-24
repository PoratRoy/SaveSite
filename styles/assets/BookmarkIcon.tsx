
import React from "react";

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M5 3C3.89543 3 3 3.89543 3 5V21L12 17L21 21V5C21 3.89543 20.1046 3 19 3H5Z" />
    </svg>
  );
};

export default BookmarkIcon;
