import React, { useRef, useState } from "react";
import { Inter } from "@next/font/google";
import { Navbar, HomeWrapper, Footer } from "../components";
import VideoPlayer from "@/components/VideoPlayer";
import dynamic from 'next/dynamic'

const AudioBar = dynamic(
  () => import("@/components/AudioBar"),
  { ssr: false }
)
type Props = {

};


const videoUrl = "/sample.mp4";
const audioUrl = "/memories.mp3";

export default function Editor(props: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  const handleSelectionChange = (start: number, end: number) => {
    setStart(start);
    setEnd(end);
  };


  return (
    <HomeWrapper>
      <Navbar />
      <div className="w-full justify-center pt-10">
        <VideoPlayer videoSrc={videoUrl} />
        <AudioBar audioSrc={audioUrl} videoRef={videoRef} onSelectionChange={handleSelectionChange} />
      </div>
      <Footer />
    </HomeWrapper>
  );
}
