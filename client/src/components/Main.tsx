import React from "react";
import Typewriter from "typewriter-effect";
import { PlayList, Editor } from "./index";

type Props = {};

const Main = (props: Props) => {
  return (
    <div className="space-y-4 w-full text-3xl">
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
        <PlayList />
      </div>
    </div>
  );
};

export default Main;
