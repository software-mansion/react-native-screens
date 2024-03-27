import {YT} from "../../utils/Youtube";
import {useEffect, useMemo, useState} from "react";
import RNFS from "react-native-fs";
import Logger from "../../utils/Logger";

const LOGGER = Logger.extend("YTDASH");

const dashFolder = [RNFS.CachesDirectoryPath, "dash"].join("/");

// TODO: Allow selectors in Settings?

function bestAudioVideoFilter(videoInfo: YT.VideoInfo) {
  const video = videoInfo.chooseFormat({type: "video", quality: "best"});
  const audio = videoInfo.chooseFormat({type: "audio", quality: "best"});

  return (format: typeof video) => {
    if (format.itag === video.itag || format.itag === audio.itag) {
      LOGGER.debug("Selected: ", format.quality + " " + format.audio_quality);
      return true;
    }
    return false;
  };
}

async function exportDashFile(videoInfo: YT.VideoInfo) {
  // Check for Cache file
  const folder = await RNFS.exists(dashFolder);
  if (!folder) {
    await RNFS.mkdir(dashFolder);
  }
  const filePath = [dashFolder, `${videoInfo.basic_info.id}.xml`].join("/");
  const dashFileExists = await RNFS.exists(filePath);
  // TODO: Remove once dash works correctly
  if (true) {
    const dashContent = await videoInfo.toDash(undefined, undefined);
    // LOGGER.debug("Dash content: ", dashContent);
    await RNFS.writeFile(filePath, dashContent, "utf8");
  }
  return filePath;
}

export default function useYoutubeDash(videoInfo: YT.VideoInfo) {
  const [dashUrl, setDashUrl] = useState<string>();

  useEffect(() => {
    exportDashFile(videoInfo).then(setDashUrl).catch(console.warn);
  }, [videoInfo]);

  const [videoQuality, audioQuality] = useMemo(() => {
    const video = videoInfo.chooseFormat({type: "video", quality: "best"});
    const audio = videoInfo.chooseFormat({type: "audio", quality: "best"});

    // TODO: Map to better naming!

    return [video.quality, audio.audio_quality];
  }, [videoInfo]);

  return {dashUrl, videoQuality, audioQuality};
}
