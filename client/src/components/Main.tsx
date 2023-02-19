import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { PlayList, Editor } from "./index";
import VideoPlayer from "./VideoPlayer";


type Props = {
  songPlaying: boolean

};



const Main = (props: Props) => {
  const [playing, setPlaying] = useState(-1);
  console.log(playing);

  return (
    <div className=" ${playing != -1  ? 'invisible' : 'visible'}$ space-y-4 w-full text-3xl">
      <div className="flex flex-col space-y-4 justify-center items-center">
        <p>Create visuals for your next</p>
        <Typewriter
          options={{
            strings: [
              "Song",
              "Playlist",
              "Album",
              "Festival",
              "Party",
              "Concert",
            ],
            autoStart: true,
            loop: true,
          }}
        />
        <Editor />
      </div>
      <div className="relative scrollbar-hide">
        <PlayList playing={playing} setPlaying={setPlaying} />
      </div>
    </div>
  );
};

export default Main;
