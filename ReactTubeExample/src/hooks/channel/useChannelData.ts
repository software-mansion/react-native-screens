import {YT, Helpers, YTNodes} from "../../utils/Youtube";
import {useCallback, useEffect, useRef, useState} from "react";
import Logger from "../../utils/Logger";

const LOGGER = Logger.extend("CHANNEL");

export type ChannelContentTypes =
  | "Home"
  | "Videos"
  | "Playlists"
  | "Reels"
  | "Search";

function getYTNodes(
  data: YT.ChannelListContinuation | YT.Channel,
  type: ChannelContentTypes,
) {
  if (type === "Home") {
    const page = data.page_contents;
    if (page.is(YTNodes.SectionList)) {
      return page.contents;
    }
  } else if (type === "Videos") {
    return data.videos;
  } else if (type === "Reels") {
    return data.videos;
  } else if (type === "Playlists") {
    return data.playlists;
  }
  LOGGER.debug("Unknown type to get YTNodes");
  return [] as Helpers.YTNode[];
}

// TODO: Optimize

export default function useChannelData(
  channel: YT.Channel,
  type: ChannelContentTypes,
) {
  const [data, setData] = useState<YT.Channel>();
  const [nodes, setNodes] = useState<Helpers.YTNode[]>([]);
  const ref = useRef<YT.ChannelListContinuation>();

  // const getNewestData = () => (data ? data : channel);

  useEffect(() => {
    const updateData = (newData: YT.Channel) => {
      setData(newData);
      setNodes(getYTNodes(newData, type));
    };

    if (type === "Home") {
      channel.getHome().then(updateData).catch(LOGGER.warn);
    } else if (type === "Videos") {
      channel.getVideos().then(updateData).catch(LOGGER.warn);
    } else if (type === "Reels") {
      channel.getShorts().then(updateData).catch(LOGGER.warn);
    } else if (type === "Playlists") {
      channel.getPlaylists().then(updateData).catch(LOGGER.warn);
    } else {
      LOGGER.warn("Unsupported Channel Data: ", type);
    }
    ref.current = undefined;
  }, [channel, type]);

  const fetchMore = useCallback(async () => {
    const newestData = ref.current ?? data;
    if (newestData && newestData.has_continuation) {
      const cData = await newestData.getContinuation();
      ref.current = cData;
      const newNodes = getYTNodes(cData, type);
      setNodes([...nodes, ...newNodes]);
    } else {
      LOGGER.warn("No Continuation available");
    }
  }, [type, nodes, data]);

  // LOGGER.debug("Data: ", JSON.stringify(data?.videos, null, 4));
  LOGGER.debug("Continue: ", data?.has_continuation);

  return {data, nodes: nodes, grid: type === "Home", fetchMore};
}
