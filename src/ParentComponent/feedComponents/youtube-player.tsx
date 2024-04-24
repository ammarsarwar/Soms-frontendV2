import React from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ videoId }: { videoId: any }) => {
  if (videoId === null) return;
  console.log(videoId);
  // Set up event handlers
  const onReady = (event: any) => {
    // Access the player instance
    const player = event.target;

    // For example, you can automatically play the video
    player.playVideo();
  };

  const onError = (error: any) => {
    console.error("YouTube Player Error:", error);
  };

  return <YouTube videoId={videoId} onReady={onReady} onError={onError} />;
};

export default YouTubePlayer;
