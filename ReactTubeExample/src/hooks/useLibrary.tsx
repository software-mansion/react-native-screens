import {useFeedData} from "./general/useFeedData";
import Logger from "../utils/Logger";

const LOGGER = Logger.extend("SUBS");

type TYPE = "Playlists" | "History" | "WatchLater";

export default function useLibrary(type?: TYPE) {
  const {content, fetchMore} = useFeedData(async youtube => {
    const library = await youtube.getLibrary();
    // const rtn = library?.history() ?? library;
    return library;
  });

  return {content, fetchMore};
}
