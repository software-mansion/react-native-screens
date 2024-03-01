import {Feed} from "../utils/Youtube";
import {useFeedData} from "./general/useFeedData";
import Logger from "../utils/Logger";

const LOGGER = Logger.extend("SUBS");

export default function useHistory() {
  const {content, contentFetched, fetchMore, setFeed, feed} = useFeedData(
    youtube => youtube.getHistory(),
  );

  console.log(content.length);

  return {content, fetchMore};
}
