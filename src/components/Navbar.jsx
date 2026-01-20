import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 sm:px-24 bg-white shadow">
      <h1 className="text-2xl font-bold text-gray-800">LMS</h1>

      <Link
        to="/login"
        className="
          px-6 py-2 
          bg-blue-600 text-white 
          rounded-full 
          hover:bg-blue-700 
          active:scale-95 
          transition-all duration-200
        "
      >
        Login
      </Link>
      {/* <Link
  to="/register"
  className="border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
>
  Register
</Link> */}

    </div>
  );
};

export default Navbar;
