import React, { useRef, useState } from "react";
import { Inter } from "@next/font/google";
import { Navbar, HomeWrapper, Footer } from "../components";
import VideoPlayer from "@/components/VideoPlayer";
import dynamic from "next/dynamic";
import {
  Select,
  ColorPicker,
  Slider,
  RangeSlider,
  Popover,
} from "@mantine/core";
import { BsFillPencilFill } from "react-icons/bs";

const AudioBar = dynamic(() => import("@/components/AudioBar"), { ssr: false });
type Props = {};

const videoUrl = "/sample.mp4";
const audioUrl = "/sample.mp3";

const RTE = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

export default function Editor(props: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 10]);
  const [loading, setLoading] = useState(false);
  const [prompt, onChange] = useState("");
  const [artStyle, setArtStyle] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(100);
  const [objects, setObjects] = useState<string | null>(null);
  const [tempoChange, setTempoChange] = useState<string | null>(null);
  const [color, setColor] = useState("#357e96b3");
  const [colorShow, setColorShow] = useState(false);

  const video = useRef<HTMLVideoElement>(null);

  const handleSelectionChange = (start: number, end: number) => {
    setStart(start);
    setEnd(end);
  };

  const handlePlay = () => {
    video?.current?.play();
  };

  const generateWith = async () => {
    setLoading(true);
  };

  const generateWithout = async () => {
    setLoading(true);
  };

  return (
    <HomeWrapper>
      <Navbar />
      <div className="w-full flex justify-between space-x-20 pt-10">
        <div className="w-4/12 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-2xl">Edit Video Specifics</p>
            <div>
              <p className="pb-1">Prompt</p>
              <RTE
                id="rte"
                value={prompt}
                onChange={onChange}
                placeholder="Enter your prompt here"
                formats={["bold", "italic", "underline"]}
                controls={[]}
                styles={{
                  toolbar: {
                    display: "none",
                  },
                }}
              />
            </div>
            <div className="wrapper relative">
              <div className="row">
                <div className="element">Color</div>
                <div className="flex justify-end space-x-4 items-center">
                  <p className="text-right">{color}</p>
                  <Popover width={200} position="bottom" shadow="md">
                    <Popover.Target>
                      <BsFillPencilFill
                        onClick={() => setColorShow(!colorShow)}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <div className="right-0">
                        <p className=""></p>
                        <div className="flex justify-end">
                          <ColorPicker
                            format="hexa"
                            value={color}
                            onChange={setColor}
                          />
                        </div>
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                </div>
              </div>

              <div className="row">
                <div className="element">Art Style</div>
                <Select
                  className="element"
                  value={artStyle}
                  onChange={setArtStyle}
                  data={[
                    "Photo realistic",
                    "Abstract Expressionism",
                    "Art Deco",
                    "Art Nouveau",
                    "Avant-garde",
                    "Baroque",
                    "Bauhaus",
                    "Classicism",
                    "CoBrA",
                    "Color Field Painting",
                    "Conceptual Art",
                    "Constructivism",
                    "Cubism",
                    "Dada / Dadaism",
                    "Digital Art",
                    "Expressionism",
                    "Fauvism",
                    "Futurism",
                    "Harlem Renaissance",
                  ]}
                />
              </div>
              <div className="row">
                <div className="element">Speed</div>
                <Slider
                  min={25}
                  max={175}
                  className="element relative"
                  value={speed}
                  onChange={setSpeed}
                  label={speed + "%"}
                  styles={{
                    track: {
                      width: "95%",
                    },
                  }}
                />
              </div>
              <div className="row">
                <div className="element">Tempo Change</div>
                <Select
                  className="element"
                  value={tempoChange}
                  onChange={setTempoChange}
                  data={[
                    "Ritardando - little by little slowing down",
                    "Ritenuto - slow down suddenly",
                    "Accelerando - gradually accelerating",
                  ]}
                />
              </div>
              <div className="row">
                <div className="element">Objects</div>
                <Select
                  className="element"
                  value={objects}
                  onChange={setObjects}
                  data={[
                    "Human",
                    "Animal",
                    "Plant",
                    "Inanimate",
                    "Abstract",
                    "Food",
                    "Drink",
                    "Clothing",
                    "Furniture",
                    "Vehicle",
                    "Energy Wave",
                    "Tool",
                    "Musical Instrument",
                    "Natural Object",
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-x-4">
            <button
              className="text-white transition-all text-center px-8 py-3 rounded-lg font-extralight tracking-wider text-lg basis-full bg-teal-700 hover:bg-teal-800 cursor-pointer"
              style={{ flex: "1 0 0" }}
              onClick={() => generateWith()}
            >
              <div className="flex justify-center items-center space-x-4 ">
                <p>Regenerate With Prompts</p>
              </div>
            </button>
            <button
              className="bg-black text-white transition-all text-center px-8 py-3 rounded-lg font-extralight tracking-wider text-lg basis-full"
              onClick={() => generateWithout()}
            >
              <div className="flex justify-between items-center space-x-4">
                <p>Regenerate Without Prompts</p>
              </div>
            </button>
          </div>
        </div>
        <div className="w-8/12">
          <div className="relative">
            <video
              ref={videoRef}
              className="inset-0 object-cover"
              controls
              src={videoUrl}
              onPlay={handlePlay}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <AudioBar
            audioSrc={audioUrl}
            videoRef={videoRef}
            onSelectionChange={handleSelectionChange}
            rangeValue={rangeValue}
          />
          <RangeSlider
            labelAlwaysOn
            value={rangeValue}
            onChange={setRangeValue}
            thumbSize={14}
            mt="xl"
            min={0}
            max={videoRef?.current?.duration}
            defaultValue={[0, 5]}
            minRange={0.5}
            step={0.1}
            label={(value) => `${value.toFixed(2)} seconds`}
          />
        </div>
      </div>
      <Footer />
    </HomeWrapper>
  );
}
