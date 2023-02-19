import React, { useRef } from "react";

type Props = {
    videoSrc: string;
};

const VideoPlayer: React.FC<Props> = ({ videoSrc }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
        videoRef.current.play();
    };

    return (
        <div className="relative h-0" style={{ paddingBottom: "56.25%", width: "50%" }}>
            <video
                ref={videoRef}
                className="absolute inset-0 object-cover"
                controls
                src={videoSrc}
                onPlay={handlePlay}
                style={{ width: "100%", height: "auto" }}
            />
        </div>
    );
};

export default VideoPlayer;
