import React from "react";
import { Inter } from "@next/font/google";
import { Navbar, HomeWrapper, VideoEditor, Footer } from "../components";

type Props = {};

export default function Editor(props: Props) {
  return (
    <HomeWrapper>
      <Navbar />
      <VideoEditor />
      <Footer />
    </HomeWrapper>
  );
}
