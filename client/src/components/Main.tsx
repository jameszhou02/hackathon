import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { PlayList, Editor } from "./index";
import VideoPlayer from "./VideoPlayer";

const Main = () => {
  const [playing, setPlaying] = useState(-1);
  const [animation, setAnimation] = useState(false);

  const urls = [
    "/avicii.mp4",
    "/cudi.mp4",
    "/calvin.mp4",
    "/bebe.mp4",
    "/connie.mp4",
  ];
  const prompts = [
    "edm live show, fractals, diamonds, tessellation, bismuth, artificial light, computerized, monochrome, dark background, sparse, trippy, lofi, abstract, dull, black and white, red tint, purple tint, low detail, 480p, low definition, abyss;edm live show, fractals, diamonds, tessellation, bismuth, artificial light, computerized, monochrome, dark background, sparse, trippy, lofi, abstract, dull, black and white, abyss;edm live visual, psychedelic, ambient, misty, skulls, skeletons, shattering, bones, dubstep, fire, intense, flashy",
    "Hip-hop live show, surreal visuals, animated cartoons, moon and stars themes, smoke and fog effects, minimalist stage design, futuristic fashion, vibrant neon colors, slow motion footage, color grading with a yellow tint, dynamic stage lighting, dreamlike imagery, glitch effects, kaleidoscope patterns, abstract art, psychedelic landscapes, sci-fi references, intergalactic travel, transcendental experiences, celestial bodies",
    "Electronic dance music, high-energy DJ set, laser light show, club-style visuals, glowing orbs and spheres, kaleidoscopic patterns, mirror and reflection effects, beach and tropical themes, graffiti and street art aesthetics, visuals synced to the music beats, futuristic designs, spacey imagery, pulsing rhythms, strobe lights, holographic effects, digital rain, bright and bold color palettes, geometric shapes, 3D animations, immersive environments",
    "Pop music live show, theatrical stage design, costume changes, larger than life props, confetti and streamer cannons, bold and bright color schemes, sparkle and glitter effects, cartoonish and whimsical visuals, diamond and gemstone aesthetics, playful and bubbly vibe, retro fashion, vintage decor, disco balls, animal prints, oversized accessories, catchy slogans, neon signs, emojis and emojis, candy and sweet treats, heart motifs, flower power",
    "Alternative and indie music, intimate and personal stage setting, dreamy and surreal visuals, ethereal and ghostly aesthetics, smoke and mist effects, moody and dark color palette, vintage and retro fashion, visual storytelling through animation, artistic and abstract visuals, hand-drawn and hand-made design elements, haunting melodies, eerie soundscapes, introspective lyrics, confessional style, personal anecdotes, existential questions, metaphysical themes, experimental sounds, minimalism, DIY spirit.",
  ];
  useEffect(() => {
    console.log("playing", playing);

    if (playing >= 0) {
      setTimeout(() => {
        setAnimation(true);
      }, 1);
    } else {
      setAnimation(false);
      setTimeout(() => {
        setPlaying(-2);
      }, 150);
    }
  }, [playing]);

  return (
    <div className="w-full space-y-16 text-3xl h-[66vh]">
      <div className="flex relative flex-col justify-center items-center">
        <p className="my-8">Create visuals for your next</p>
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
        {playing !== -2 && (
          <div
            className={
              "absolute w-full h-full transition-all bg-[#A9A9A9] rounded-xl flex items-center justify-between space-x-16 p-10" +
              (animation ? " opacity-100" : " opacity-0")
            }
          >
            <div className="w-full flex flex-col items-start h-full space-y-3">
              <p className="text-2xl">Prompts</p>
              <div className="w-full rounded-lg bg-slate-700 h-full">
                <p className="p-4 text-white text-base font-light">
                  {prompts[playing]}
                </p>
              </div>
            </div>
            <video
              className="object-contain rounded-lg"
              width="560"
              src={urls[playing]}
              autoPlay
            />
          </div>
        )}
      </div>
      <div className="relative scrollbar-hide">
        <PlayList playing={playing} setPlaying={setPlaying} />
      </div>
    </div>
  );
};

export default Main;
