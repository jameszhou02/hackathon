import { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
interface Props {
  audioSrc: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  rangeValue: any;
}

const AudioBar = ({ audioSrc, videoRef, rangeValue }: Props) => {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      cursorColor: "navy",
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 50,
      backend: "MediaElement",
    });

    wavesurfer.enableDragSelection({
      drag: false,
      slop: 1,
      loop: false,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.load(audioSrc);

    wavesurfer.on("ready", function () {
      setDuration(wavesurfer.getDuration());
    });

    const handlePlay = () => {
      wavesurfer.play();
    };

    const handlePause = () => {
      wavesurfer.pause();
    };

    const handleSeek = () => {
      if (videoRef.current && wavesurferRef.current) {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
        if (time < duration) {
          wavesurferRef.current.seekTo(time / duration);
        }
      }
    };

    videoRef.current?.addEventListener("play", handlePlay);
    videoRef.current?.addEventListener("pause", handlePause);
    videoRef.current?.addEventListener("timeupdate", handleSeek);

    return () => {
      videoRef.current?.removeEventListener("play", handlePlay);
      videoRef.current?.removeEventListener("pause", handlePause);
      videoRef.current?.removeEventListener("timeupdate", handleSeek);
      wavesurfer.destroy();
    };
  }, [audioSrc, duration, videoRef]);

  return (
    <div>
      <div id="waveform" style={{ width: "100%" }}></div>
      <div className="flex justify-between">
        <span>{currentTime.toFixed(2)}</span>
        <span>{duration.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default AudioBar;
