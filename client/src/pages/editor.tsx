import React from "react";
import { Inter } from "@next/font/google";
import { Navbar, HomeWrapper, Footer } from "../components";
import VideoPlayer from "@/components/VideoPlayer";

type Props = {

};
const url = "/sample.mp4";
export default function Editor(props: Props) {
  return (
    <HomeWrapper>
      <Navbar />
      <div className="w-full flex justify-center pt-10">
        <VideoPlayer videoSrc={url} />
      </div>
      <Footer />
    </HomeWrapper>
  );
}
