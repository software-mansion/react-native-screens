import React, {useCallback, useMemo, useRef, useState} from "react";
// @ts-ignore
import {VLCPlayer} from "react-native-vlc-media-player";
import {Text, useTVEventHandler} from "react-native";
import VideoProgressBar, {Progress as BarProgress} from "./VideoProgressBar";
import {useSharedValue} from "react-native-reanimated";
import Logger from "../../utils/Logger";
import {Duration} from "luxon";
import VLCPlayerWrapper from "./VLCPlayerWrapper";
import VideoControl from "./VideoControl";
import VideoInfo from "./VideoInfo";
import {YT} from "../../utils/Youtube";

const LOGGER = Logger.extend("VLCPLAYERCONTROLS");

function durationString(millis: number) {
  return Duration.fromMillis(millis).toFormat("mm:ss");
}

function getProgress(duration: number, wantedLength: number) {
  return wantedLength / duration;
}

function seekFunction() {}

interface Progress {
  currentTime: number;
  duration: number;
  position: number;
  remainingTime: number;
  target: number;
}

interface Props extends React.ComponentPropsWithoutRef<VLCPlayer> {
  disableControls?: boolean;
  quality: (string | undefined)[];
  videoInfo: YT.VideoInfo;
}

export default function VLCPlayerControls(props: Props) {
  const player = useRef<VLCPlayer>();
  const progress = useRef<Progress | undefined>(undefined);
  const pause = useRef(false);
  const [state, setState] = useState<Progress | undefined>();

  const progressValue = useSharedValue(0);
  const progressSharedValue = useSharedValue<BarProgress | undefined>(
    undefined,
  );

  const showControls = useSharedValue(false);

  const onProgress = useCallback(
    (p: Progress) => {
      // Workaround for repeat issue
      if (
        p.currentTime < 10000 &&
        progress.current &&
        progress.current.remainingTime > -15000
      ) {
        LOGGER.debug("Pause!");
        pause.current = true;
        player.current.setNativeProps({paused: true});
        props.onEnded();
      }
      // --
      progress.current = p;
      progressValue.value = p.position * 100;
      progressSharedValue.value = {
        currentTime: p.currentTime,
        position: p.position,
        duration: p.duration,
        remainingTime: p.remainingTime,
        currentTimeString: durationString(p.currentTime),
        durationString: durationString(p.duration),
      };
      setState(p);
      // LOGGER.debug(JSON.stringify(p));
    },
    [progressValue, progressSharedValue, props],
  );

  // console.log("Progress: ", progress.current);

  useTVEventHandler(event => {
    if (event.eventType === "select") {
      showControls.value = !showControls.value;
    } else if (event.eventType === "playPause") {
      pause.current = !pause.current;
      player.current.setNativeProps({paused: pause.current});
    } else if (
      !props.disableControls &&
      (event.eventType === "left" || event.eventType === "right")
    ) {
      if (progress.current !== undefined) {
        const seekProgress = getProgress(progress.current.duration, 10000);
        const newSeekPosition =
          progress.current.position +
          (event.eventType === "left" ? -seekProgress : seekProgress);
        player.current.seek(newSeekPosition);
        onProgress({
          ...progress.current,
          position: newSeekPosition,
          currentTime: progress.current.duration * newSeekPosition,
        });
        // progress.current.position = newSeekPosition;
        // progressValue.value = newSeekPosition * 100;
      }
    }
  });

  const duration = useMemo(
    () => (state?.duration ? durationString(state.duration) : ""),
    [state?.duration],
  );

  const curState = useMemo(
    () => (state?.currentTime ? durationString(state.currentTime) : ""),
    [state?.currentTime],
  );

  // console.log("State: ", state);

  return (
    <>
      <VLCPlayerWrapper
        ref={player}
        source={props.source}
        style={props.style}
        onProgress={onProgress}
      />
      <VideoControl
        show={showControls}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: "#22222299",
        }}>
        <VideoInfo videoInfos={props.videoInfo} />
        <Text>{props.quality?.[0] ?? ""}</Text>
        <VideoProgressBar
          // TODO: Extract Chapters: https://github.com/LuanRT/YouTube.js/pull/263
          progressValue={progressSharedValue}
          currentString={curState}
          durationString={duration}
        />
      </VideoControl>
    </>
  );
}
