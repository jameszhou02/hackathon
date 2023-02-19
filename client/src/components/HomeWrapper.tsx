import React from "react";

type Props = {
  children: React.ReactNode;
};

const HomeWrapper = ({ children }: Props) => {
  return <div className="px-24 min-h-screen">{children}</div>;
};

export default HomeWrapper;
