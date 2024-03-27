import {useYoutubeContext} from "../context/YoutubeContext";
import {useCallback, useEffect, useState} from "react";
import {Feed} from "youtubei.js";
import {useFeedData} from "./general/useFeedData";
import Logger from "../utils/Logger";

const LOGGER = Logger.extend("SUBS");

export default function useSubscriptions() {
  const youtube = useYoutubeContext();
  // useEffect(() => {
  //   youtube
  //     ?.getSubscriptionsFeed()
  //     .then(value => {
  //       console.log("HI");
  //       console.log(value.page_contents);
  //     })
  //     .catch(console.warn);
  // }, []);
  const {content, contentFetched, fetchMore, setFeed, feed} = useFeedData(
    youtube => youtube.getSubscriptionsFeed(),
  );

  // useEffect(() => {
  //   youtube
  //     ?.getSubscriptionsFeed()
  //     .then(value => {
  //       setFeed(value);
  //       contentFetched(value.page_contents, true);
  //     })
  //     .catch(LOGGER.warn);
  // }, [youtube, setFeed]);
  //
  // const fetchMore = useCallback(async () => {
  //   if (!feed) {
  //     throw Error("No Feed");
  //   }
  //   const data = await feed.getContinuation();
  //   contentFetched(data.page_contents);
  // }, [feed]);
  //
  // useEffect(() => {
  //   if (content.length < 4) {
  //     fetchMore().catch(LOGGER.warn);
  //   }
  // }, [content]);

  console.log(content.length);

  return {content, fetchMore};
}
