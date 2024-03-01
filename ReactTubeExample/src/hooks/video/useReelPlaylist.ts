import {useYoutubeContext} from "../../context/YoutubeContext";
import {YTNodes, YTShorts, Helpers} from "../../utils/Youtube";
import {useEffect, useState} from "react";
import _ from "lodash";

export function useReelPlaylist(reelId?: string) {
  const youtube = useYoutubeContext();
  const [shortItem, setShortItem] = useState<YTShorts.VideoInfo>();

  const [elements, setElements] = useState<string[]>();

  useEffect(() => {
    if (!reelId) {
      return;
    }

    youtube
      ?.getShortsWatchItem(reelId)
      .then(item => {
        setShortItem(item);
        const data = extractVideoIds(item.watch_next_feed);
        setElements([...(elements ?? []), ...data]);
      })
      .catch(console.warn);
  }, [reelId, youtube]);

  console.log("Elements: ", JSON.stringify(elements));

  const fetchMore = () => {
    shortItem
      ?.getWatchNextContinuation()
      .then(item => {
        setShortItem(item);
        const data = extractVideoIds(item.watch_next_feed);
        setElements([...(elements ?? []), ...data]);
      })
      .catch(console.warn);
  };

  return {elements, fetchMore};
}

function extractVideoIds(arr?: Helpers.ObservedArray) {
  const data =
    arr?.map(v => {
      return v.as(YTNodes.Command)?.endpoint?.payload?.videoId as
        | string
        | undefined;
    }) ?? [];
  return _.compact(data);
}
