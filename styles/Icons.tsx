export interface IconProps {
  className?: string;
  size?: number;
  fill?: string;
}

// Chevron Right Icon
export function ChevronRightIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z" 
        fill={fill}
      />
    </svg>
  );
}

// Chevron Down Icon
export function ChevronDownIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" 
        fill={fill}
      />
    </svg>
  );
}

// Folder Icon
export function FolderIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M3 6C3 4.34315 4.34315 3 6 3H9.17157C9.70201 3 10.2107 3.21071 10.5858 3.58579L12.4142 5.41421C12.7893 5.78929 13.298 6 13.8284 6H18C19.6569 6 21 7.34315 21 9V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" 
        fill={fill}
      />
    </svg>
  );
}

// Folder Plus Icon
export function FolderPlusIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V9C21 7.34315 19.6569 6 18 6H13.8284C13.298 6 12.7893 5.78929 12.4142 5.41421L10.5858 3.58579C10.2107 3.21071 9.70201 3 9.17157 3H6ZM12 9C12.5523 9 13 9.44772 13 10V11.5H14.5C15.0523 11.5 15.5 11.9477 15.5 12.5C15.5 13.0523 15.0523 13.5 14.5 13.5H13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13.5H9.5C8.94772 13.5 8.5 13.0523 8.5 12.5C8.5 11.9477 8.94772 11.5 9.5 11.5H11V10C11 9.44772 11.4477 9 12 9Z" 
        fill={fill}
      />
    </svg>
  );
}

// Website/Globe Icon
export function WebsiteIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM9.71002 19.6683C8.74743 17.6534 8.15732 15.3889 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6683ZM10.0307 13C10.1811 15.4466 10.8778 17.7318 12 19.752C13.1222 17.7318 13.8189 15.4466 13.9693 13H10.0307ZM15.9727 13C15.8427 15.3889 15.2526 17.6534 14.29 19.6683C17.2836 18.7747 19.542 16.1765 19.9381 13H15.9727ZM19.9381 11C19.542 7.82354 17.2836 5.22535 14.29 4.33165C15.2526 6.34656 15.8427 8.61111 15.9727 11H19.9381ZM13.9693 11C13.8189 8.55342 13.1222 6.26817 12 4.24799C10.8778 6.26817 10.1811 8.55342 10.0307 11H13.9693ZM8.02731 11C8.15732 8.61111 8.74743 6.34656 9.71002 4.33165C6.71639 5.22535 4.458 7.82354 4.06189 11H8.02731Z" 
        fill={fill}
      />
    </svg>
  );
}

// Link Icon
export function LinkIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M13.5441 6.45593C14.7146 5.28544 16.6277 5.28544 17.7982 6.45593C18.9687 7.62642 18.9687 9.53947 17.7982 10.71L15.6269 12.8813C14.4564 14.0518 12.5433 14.0518 11.3728 12.8813C11.0799 12.5884 10.605 12.5884 10.3121 12.8813C10.0192 13.1742 10.0192 13.6491 10.3121 13.942C11.8973 15.5272 14.4024 15.5272 15.9876 13.942L18.1589 11.7707C19.7441 10.1855 19.7441 7.68034 18.1589 6.09512C16.5737 4.5099 14.0685 4.5099 12.4833 6.09512L11.3976 7.18081C11.1047 7.47371 11.1047 7.94858 11.3976 8.24147C11.6905 8.53437 12.1654 8.53437 12.4583 8.24147L13.5441 6.45593Z" 
        fill={fill}
      />
      <path 
        d="M8.37309 11.1187C9.54358 9.94818 11.4567 9.94818 12.6272 11.1187C12.9201 11.4116 13.395 11.4116 13.6879 11.1187C13.9808 10.8258 13.9808 10.3509 13.6879 10.058C12.1027 8.47277 9.59753 8.47277 8.01231 10.058L5.84099 12.2293C4.25577 13.8145 4.25577 16.3197 5.84099 17.9049C7.42621 19.4901 9.93137 19.4901 11.5166 17.9049L12.6023 16.8192C12.8952 16.5263 12.8952 16.0514 12.6023 15.7585C12.3094 15.4656 11.8345 15.4656 11.5416 15.7585L10.4559 17.5441C9.28544 18.7146 7.37238 18.7146 6.20189 17.5441C5.0314 16.3736 5.0314 14.4605 6.20189 13.29L8.37309 11.1187Z" 
        fill={fill}
      />
    </svg>
  );
}

// Trash Icon
export function TrashIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M10 2C9.44772 2 9 2.44772 9 3V4H6C5.44772 4 5 4.44772 5 5C5 5.55228 5.44772 6 6 6H7V19C7 20.6569 8.34315 22 10 22H14C15.6569 22 17 20.6569 17 19V6H18C18.5523 6 19 5.55228 19 5C19 4.44772 18.5523 4 18 4H15V3C15 2.44772 14.5523 2 14 2H10ZM9 8C9 7.44772 9.44772 7 10 7C10.5523 7 11 7.44772 11 8V18C11 18.5523 10.5523 19 10 19C9.44772 19 9 18.5523 9 18V8ZM14 7C13.4477 7 13 7.44772 13 8V18C13 18.5523 13.4477 19 14 19C14.5523 19 15 18.5523 15 18V8C15 7.44772 14.5523 7 14 7Z" 
        fill={fill}
      />
    </svg>
  );
}

// Search Icon
export function SearchIcon({ className = "", size = 20, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Edit Icon
export function EditIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" 
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// More Vertical Icon (3 dots)
export function MoreVerticalIcon({ className = "", size = 16, fill = "currentColor" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" 
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" 
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" 
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
