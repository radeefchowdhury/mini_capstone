// components/NavBar.js

import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src="/your-logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-white text-lg font-semibold">Your App Name</span>
      </div>

      {/* Navigation options in the middle */}
      <div className="flex space-x-4">
        <Link href="/">
          <a className="text-white">Option 1</a>
        </Link>
        <Link href="/option2">
          <a className="text-white">Option 2</a>
        </Link>
        <Link href="/option3">
          <a className="text-white">Option 3</a>
        </Link>
        <Link href="/option4">
          <a className="text-white">Option 4</a>
        </Link>
      </div>

      {/* Profile picture and bell icon on the right */}
      <div className="flex items-center">
        <img src="/profile-picture.jpg" alt="Profile" className="w-8 h-8 rounded-full mr-2" />
        <span className="text-white mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 22h-2a2 2 0 01-2-2V9a5 5 0 00-5-5H8a5 5 0 00-5 5v11a2 2 0 01-2 2H2"
            />
          </svg>
        </span>
        <span className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 22h-2a2 2 0 01-2-2V9a5 5 0 00-5-5H8a5 5 0 00-5 5v11a2 2 0 01-2 2H2"
            />
          </svg>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
