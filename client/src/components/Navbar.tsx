import React from "react";
import { IoLogoAppleAr } from "react-icons/io5";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between items-en py-10">
      <div className="flex-1 flex space-x-4 items-center text-4xl font-extralight">
        <IoLogoAppleAr />
        <p>Diffuser</p>
      </div>
      <div className="flex space-x-8 items-center text-2xl font-extralight">
        <p>About</p>
        <p>Usage</p>
        <p>Sign In</p>
      </div>
    </div>
  );
};

export default Navbar;
