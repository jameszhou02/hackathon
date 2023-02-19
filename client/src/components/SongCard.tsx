import React from "react";

type Props = {
  song: string;
  artist: string;
  album: string;
  albumPic: string;
  onClick: any;
  selected: any;
};

const SongCard = ({
  song,
  artist,
  album,
  albumPic,
  onClick,
  selected,
}: Props) => {
  return (
    <div className="flex space-x-4 rounded-2xl bg-opacity-25 backdrop-blur-sm bg-white/30 text-base font-light w-64 h-auto p-4">
      <div>
        <img src={albumPic} alt="Album Art" className="h-16" />
        <p>{album}</p>
      </div>
      <div className="flex flex-col justify-between text-left">
        <p>{song}</p>
        <p>{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
