import {useEffect, useRef, useState} from "react";
import {useTVEventHandler} from "react-native";

const countdownStart = 5;

export default function useNextVideo(goToNextVideo: () => void) {
  const [countdown, setCountdown] = useState(0);
  const stopRef = useRef(false);

  useEffect(() => {
    console.log("Starting counter");
    setCountdown(countdownStart);
  }, []);

  useTVEventHandler(event => {
    switch (event.eventType) {
      case "up":
      case "down":
      case "left":
      case "right":
        if (!stopRef.current) {
          stopRef.current = true;
        }
    }
  });

  useEffect(() => {
    const handler = setInterval(() => {
      if (stopRef.current) {
        clearInterval(handler);
      } else if (countdown > 0) {
        setCountdown(countdown - 1);
      }
      console.log("Running handler: ", countdown);
      if (countdown <= 0 && !stopRef.current) {
        goToNextVideo();
        clearInterval(handler);
      }
    }, 1000);

    return () => clearInterval(handler);
  }, [countdown, goToNextVideo]);

  return {
    countdown,
  };
}
