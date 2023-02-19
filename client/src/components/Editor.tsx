import React, { useState, useEffect } from "react";
import {
  TextInput,
  Loader,
  Group,
  Text,
  useMantineTheme,
  Modal,
  Select,
  ColorPicker,
  Slider,
} from "@mantine/core";
import dynamic from "next/dynamic";
import {
  Dropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
  FileWithPath,
} from "@mantine/dropzone";
import { IoIosCloudUpload, IoMdOptions } from "react-icons/io";
import { TiCancel } from "react-icons/ti";
import { MdAudiotrack } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { BsFillPencilFill } from "react-icons/bs";
import { RichTextEditor } from "@mantine/rte";

type Props = {};

const RTE = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

const Editor = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [file, setFile] = useState<any>(null);
  const [opened, setOpened] = useState(false);
  const [prompt, onChange] = useState("");
  const [artStyle, setArtStyle] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(100);
  const [objects, setObjects] = useState<string | null>(null);
  const [effects, setEffects] = useState<string | null>(null);
  const [tempoChange, setTempoChange] = useState<string | null>(null);
  const [color, setColor] = useState("#357e96b3");
  const [colorShow, setColorShow] = useState(false);

  // // Create a storage reference from our storage service
  // // const storageRef = ref(storage);
  // const storageRef = ref(storage, "mountains.jpg");

  useEffect(() => {
    // if (files.length > 0) {
    //   const file = files[0];
    //   const fileRef = ref(storage, file.name);
    //   uploadBytes(fileRef, file).then((snapshot) => {
    //     console.log('Uploaded a blob or file!');
    //   });
    // }
    if (files.length > 0 && !error) {
      setFile(files[0]);
      setValue("");
    }
  }, [files]);

  const handleCreate = async () => {
    if (value.length > 0 || file) {
      if (file) {
        setLoading(true);
        setCreateError(false);
        setError(false);
        const fileRef = ref(storage, file.name);
        await uploadBytes(fileRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });

        const mp3 = await fetch("http://localhost:4000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            fileName: file.name,
            artStyle: artStyle,
            speed: speed,
            objects: objects,
            effects: effects,
            tempoChange: tempoChange,
          }),
        });
        // wait for ml stuff
        // fetch ml stuff
        // load video underneath
        // provide option to edit further -> editor
        setLoading(false);
      } else {
        let res;
        await isValidYouTubeLink(value)
          .then((isValid) => {
            console.log(isValid ? "Valid video" : "Invalid video");
            if (isValid) {
              res = true;
              setError(false);
            } else {
              res = false;
            }
          })
          .catch((error) => {
            console.error(error);
            res = false;
          });

        if (res) {
          console.log("here");
          const test = await fetch("http://localhost:4000/uploadyoutube", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
              url: value,
            }),
          });
          const testJson = await test.json();
          console.log(testJson);
        } else {
          setError(true);
        }
      }
    } else {
      setCreateError(true);
    }
  };

  const fetch = require("node-fetch");

  const videoIdRegex =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  function isValidYouTubeLink(url) {
    const videoId = extractVideoId(url);
    if (!videoId) {
      return Promise.resolve(false);
    }
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=id&key=AIzaSyAPLlV2-9zjwvsgOA9ZBbD_23FjPk-vYhM`;
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => data.items.length > 0);
  }

  function extractVideoId(url) {
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col space-y-4 items-center justify-center">
        {/* <TextInput
          placeholder="Your link here"
          variant="filled"
          className="w-3/4"
          rightSection={<AiOutlineSearch size={16} />}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        /> */}
        <Dropzone
          onDrop={(files) => {
            setFiles(files);
            setError(false);
          }}
          onReject={(files) => {
            setError(true);
          }}
          maxSize={10 * 1024 ** 2}
          accept={{
            "audio/*": [".mp3", "mpeg", ".wav", ".aac", ".ogg", ".m4a"],
          }}
          {...props}
          maxFiles={1}
          className="w-3/4"
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 100, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IoIosCloudUpload size={50} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <TiCancel size={50} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <MdAudiotrack size={50} className="text-slate-500 opacity-70" />
            </Dropzone.Idle>
            <div>
              <p className="text-2xl inline text-slate-500 opacity-70">
                Drag an audio file here or click to upload
              </p>
            </div>
          </Group>
        </Dropzone>
        {error && (
          <div>
            <p className="text-red-500 text-light text-xl">
              Error, file type not supported
            </p>
          </div>
        )}
        <div className="grid grid-flow-row grid-cols-2 gap-x-4">
          <button
            className={
              "text-white transition-all text-center px-8 py-3 rounded-lg font-extralight tracking-wider text-lg basis-full " +
              (value.length > 0 || !error
                ? " bg-teal-700 hover:bg-teal-800 cursor-pointer"
                : " bg-slate-700 hover:bg-slate-800 cursor-not-allowed")
            }
            style={{ flex: "1 0 0" }}
            onClick={() => handleCreate()}
          >
            <div className="flex justify-center items-center space-x-4 ">
              <p>Create</p>
              {loading && <Loader size="xs" />}
            </div>
          </button>
          <button
            className="bg-black text-white transition-all text-center px-8 py-3 rounded-lg font-extralight tracking-wider text-lg basis-full"
            onClick={() => setOpened(true)}
          >
            <div className="flex justify-between items-center space-x-4">
              <p>Options</p>
              <IoMdOptions size={16} />
            </div>
          </button>
        </div>
        {createError && (
          <p className="text-red-500 my-5 text-xl">
            Please submit a valid link or file
          </p>
        )}
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Options "
          centered
          size="xl"
        >
          <div>
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
                  <BsFillPencilFill onClick={() => setColorShow(!colorShow)} />
                </div>
              </div>
              {colorShow && (
                <div className="row">
                  <p className="element"></p>
                  <div className="element flex justify-end">
                    <ColorPicker
                      format="hexa"
                      value={color}
                      onChange={setColor}
                    />
                  </div>
                </div>
              )}
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
              {/* <div className="row">
                <div className="element">Effects</div>
                <Select
                  className="element"
                  value={effects}
                  onChange={setEffects}
                  data={[
                    "Reverb",
                    "Delay",
                    "Chorus",
                    "Flanger",
                    "Phaser",
                    "Tremolo",
                    "Vibrato",
                    "Distortion",
                    "Overdrive",
                    "Wah",
                    "Bitcrusher",
                    "Compressor",
                    "Noise Gate",
                    "Equalizer",
                    "Pitch Shifter",
                    "Harmonizer",
                    "Ring Modulator",
                    "Auto Wah",
                    "Auto Filter",
                  ]}
                />
              </div> */}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Editor;
