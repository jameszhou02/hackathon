import React, { useState, useContext, useEffect } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

type Props = {
  playing: any;
  setPlaying: any;
}

const songData = [
  {
    id: 0,
    song: "Levels",
    artist: "Avicii",
    album: "Levels",
    albumPic: "https://upload.wikimedia.org/wikipedia/en/2/2c/Levelssong.jpg",
    url: "/levels.mp3",
  },
  {
    id: 1,
    song: "Memories",
    artist: "Kid Cudi + David Guetta",
    album: "One Love",
    albumPic:
      "https://upload.wikimedia.org/wikipedia/en/c/ce/One_Love_cover.png",
    url: "/memories.mp3",
  },
  {
    id: 2,
    song: "Under Control (feat. Hurts)",
    artist: "Calvin Harris + Alesso + Hurts",
    album: "Motion",
    albumPic:
      "https://upload.wikimedia.org/wikipedia/en/f/fb/Calvin_Harris_-_Motion.png",
    url: "/undercontrol.mp3",
  },
  {
    id: 3,
    song: "I'm Good (Blue)",
    artist: "Bebe Rexha + David Guetta",
    album: "I'm Good (Blue) (Extended Remixes)",
    albumPic:
      "https://i1.sndcdn.com/artworks-c210f265-fbd6-442a-9cfc-e3ceb4efccb0-0-t500x500.jpg",
    url: "/imgood.mp3",
  },
  {
    id: 4,
    song: "Heaven Takes You Home",
    artist: "Connie Constance + Swedish House Mafia",
    album: "Paradise Again",
    albumPic:
      "https://media.pitchfork.com/photos/62543a3e36f8f664dd4da96d/1:1/w_600/swedish-house-mafia-paradise-again.jpeg",
    url: "/heaven.mp3",
  },
];

function PlayList({ playing, setPlaying }: Props) {
  const [items, setItems] = useState(songData);
  const [audio, setAudio] = useState<any>(null);
  const [audioChange, setAudioChange] = useState(false);

  useEffect(() => {
    setAudio(new Audio(songData[playing]?.url)); // only call client
  }, []);

  const handleClick = (id) => () => {
    if (playing === id) {
      setPlaying(-1);
    } else {
      setPlaying(id);
    }
  };

  useEffect(() => {
    if (playing === -1) {
      audio?.pause();
    } else {
      setAudio((prev) => {
        prev.src = songData[playing]?.url;
        return prev;
      });
      audio?.play();
      setAudioChange((prev) => !prev);
    }
  }, [playing]);

  useEffect(() => {
    audio?.addEventListener("ended", () => {
      setPlaying((prev) => {
        if (prev === items.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    });
  }, [playing]);

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audioChange]);

  return (
    <>
      <p className="text-center my-5">Check out some examples!</p>
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {items.map((item) => (
          <Card
            itemId={item.id} // NOTE: itemitem.id is required for track items
            title={item.id}
            key={item.id}
            onClick={handleClick(item.id)}
            playing={playing}
            albumPic={item.albumPic}
            album={item.album}
            song={item.song}
            artist={item.artist}
          />
        ))}
      </ScrollMenu>
    </>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      <MdArrowBackIosNew />
    </Arrow>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
      <MdArrowForwardIos />
    </Arrow>
  );
}

function Arrow({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        background: "none",
        fontSize: "2rem",
        cursor: "pointer",
        color: disabled ? "grey" : "black",
      }}
      className="mx-4"
    >
      {children}
    </button>
  );
}

function Card({
  onClick,
  playing,
  title,
  itemId,
  albumPic,
  album,
  song,
  artist,
}) {
  const visibility = React.useContext(VisibilityContext);

  return (
    <div
      className="flex space-x-4 rounded-2xl bg-opacity-25 backdrop-blur-sm bg-white/30 text-base font-light w-80 h-auto p-4 mx-4 items-center"
      onClick={() => onClick(visibility)}
      tabIndex={0}
    >
      <div className="w-16 relative">
        <img src={albumPic} alt="Album Art" className="h-16" />
        <div
          className={
            "absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 w-full h-full top-0 transition-all hover:opacity-100 " +
            (playing === itemId ? "opacity-100" : "")
          }
        >
          {playing === itemId ? (
            <AiFillPauseCircle size={30} className="text-white" />
          ) : (
            <AiFillPlayCircle size={30} className="text-white" />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between text-left text-sm w-44">
        <p className="truncate">{song}</p>
        <p className="truncate">{artist}</p>
      </div>
    </div>
  );
}

export default PlayList;
