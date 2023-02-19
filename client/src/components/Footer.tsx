import React from "react";
import { IoLogoAppleAr } from "react-icons/io5";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="py-10 justify-center items-center space-y-4 w-full">
      <div className="flex justify-center items-center space-x-4">
        <IoLogoAppleAr />
        <p>Diffusion</p>
      </div>

      <div className="text-center flex justify-center space-x-2 p-4">
        <p>© 2023 Copyright:</p>
        <a className="text-reset fw-bold" href="/">
          diffusion.com
        </a>
      </div>
    </div>
  );
};

export default Footer;
