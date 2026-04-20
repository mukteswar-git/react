// Example 4: Video Player Control

import { useRef, useState } from "react";

function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <video ref={videoRef} width="500" src="jujustu-kiesen.mp4" />

      <div className="flex flex-row gap-6">
        <button onClick={togglePlay} className={`px-2 py-0.5 rounded ${isPlaying ? "bg-green-700 hover:bg-green-600" : "bg-red-700 hover:bg-red-600"}`}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={handleRestart} className="bg-gray-800 py-0.5 px-2 rounded hover:bg-gray-700">Restart</button>
      </div>
    </div>
  );
}

export default VideoPlayer;
