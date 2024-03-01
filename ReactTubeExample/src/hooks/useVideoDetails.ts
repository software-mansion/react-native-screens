import {useYoutubeContext} from "../context/YoutubeContext";
import {useCallback, useEffect, useMemo, useState} from "react";
import {YT, YTNodes} from "../utils/Youtube";
import Logger from "../utils/Logger";
import {useAppData} from "../context/AppDataContext";
import {getElementDataFromVideoInfo} from "../extraction/YTElements";

const LOGGER = Logger.extend("VIDEO");

export default function useVideoDetails(
  videoId: string | YTNodes.NavigationEndpoint,
) {
  const youtube = useYoutubeContext();
  const [Video, setVideo] = useState<YT.VideoInfo>();
  const {appSettings} = useAppData();

  const fetchVideoData = useCallback(() => {
    youtube
      ?.getInfo(videoId, appSettings.hlsEnabled ? "iOS" : undefined)
      .then(setVideo)
      .catch(LOGGER.warn);
  }, [appSettings.hlsEnabled, videoId, youtube]);

  useEffect(() => {
    fetchVideoData();
  }, [appSettings.hlsEnabled, videoId, youtube, fetchVideoData]);

  const YTVideoInfo = useMemo(() => {
    return Video ? getElementDataFromVideoInfo(Video) : undefined;
  }, [Video]);

  const httpVideoURL = useMemo(() => {
    if (!youtube?.actions.session.player) {
      return undefined;
    }
    // TODO: Add fallback if no matching format found
    try {
      console.log(Video?.streaming_data?.formats);
      let format = Video?.chooseFormat({
        type: "video+audio",
        quality: "best",
      });
      if (!format) {
        LOGGER.debug("Fallback to audio only Stream!");
        format = Video?.chooseFormat({
          type: "audio",
          quality: "best",
        });
      }
      LOGGER.debug("Format: ", format?.quality_label);
      return format?.decipher(youtube.actions.session.player);
    } catch (e) {
      LOGGER.warn("Error while matching formats: ", e);
    }
    return undefined;
  }, [Video, youtube]);

  LOGGER.debug("Video: ", httpVideoURL);

  const fetchNextVideoContinue = useCallback(() => {
    if (Video) {
      Video.getWatchNextContinuation().then(setVideo).catch(LOGGER.warn);
    }
  }, [Video]);

  // Actions:

  const [actionVideoData, setActionVideoData] = useState<YT.VideoInfo>();
  const [actionDataOverride, setActionDataOverride] = useState<ActionData>({});

  const fetchActionsVideoData = useCallback(() => {
    youtube
      ?.getInfo(videoId, appSettings.hlsEnabled ? "iOS" : undefined)
      .then(setActionVideoData)
      .catch(LOGGER.warn);
  }, [videoId, appSettings.hlsEnabled, youtube]);

  const actionData = useMemo(() => {
    const data = Video
      ? getElementDataFromVideoInfo(actionVideoData ?? Video)
      : undefined;
    if (data && actionDataOverride?.like !== undefined) {
      data.liked = actionDataOverride.like;
    }
    if (data && actionDataOverride?.dislike !== undefined) {
      data.disliked = actionDataOverride.dislike;
    }
    return data;
  }, [Video, actionVideoData, actionDataOverride]);

  const like = useCallback(async () => {
    setActionDataOverride({...actionDataOverride, like: true});
    await actionData?.originalData?.like();
    fetchActionsVideoData();
  }, [actionData, actionDataOverride, fetchActionsVideoData]);

  const dislike = useCallback(async () => {
    setActionDataOverride({...actionDataOverride, dislike: true});
    await actionData?.originalData?.dislike();
    fetchActionsVideoData();
  }, [actionData, actionDataOverride, fetchActionsVideoData]);

  const removeRating = useCallback(async () => {
    setActionDataOverride({dislike: false, like: false});
    await actionData?.originalData?.removeRating();
    fetchActionsVideoData();
  }, [actionData, fetchActionsVideoData]);

  const addToWatchHistory = useCallback(async () => {
    await actionData?.originalData.addToWatchHistory();
  }, [actionData]);

  return {
    Video,
    YTVideoInfo,
    hlsManifestUrl: Video?.streaming_data?.hls_manifest_url,
    httpVideoURL,
    fetchNextVideoContinue,
    //Actions
    actionData,
    like,
    dislike,
    removeRating,
    addToWatchHistory,
  };
}

interface ActionData {
  like?: boolean;
  dislike?: boolean;
}
