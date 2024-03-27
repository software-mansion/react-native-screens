import {useYoutubeContext} from "../context/YoutubeContext";
import {useCallback, useReducer, useState} from "react";
import {YT} from "../utils/Youtube";
import {Helpers} from "youtubei.js";
import Logger from "../utils/Logger";
import _ from "lodash";

const LOGGER = Logger.extend("SEARCH");

function resultReducer(
  state: Helpers.YTNode[],
  action: Helpers.YTNode[] | undefined,
) {
  if (!action) {
    return [];
  } else {
    return _.concat(state, action);
  }
}

export default function useSearchScreen() {
  const innerTube = useYoutubeContext();
  const [searchData, setSearchData] = useState<YT.Search>();
  const [searchResults, dispatch] = useReducer(resultReducer, []);

  const search = useCallback(
    async (query: string) => {
      if (!innerTube) {
        return;
      }
      const result = await innerTube.search(query);
      if (result.results && result.results.length > 0) {
        dispatch(undefined);
        dispatch(result.results);
      } else {
        LOGGER.debug("No results available");
      }
      setSearchData(result);
    },
    [innerTube],
  );

  const fetchMore = useCallback(async () => {
    if (!searchData) {
      throw new Error("No Search Available");
    }
    if (!searchData.has_continuation) {
      return new Error("No Search Continue Available");
    }
    const result = await searchData.getContinuation();
    if (result.results && result.results.length > 0) {
      dispatch(result.results);
    } else {
      LOGGER.debug("Np results available");
    }
    setSearchData(result);
  }, [searchData]);

  const searchSuggestions = useCallback(
    async (query: string) => {
      if (!innerTube) {
        return [];
      }
      return await innerTube.getSearchSuggestions(query);
    },
    [innerTube],
  );

  return {search, searchResult: searchResults, fetchMore, searchSuggestions};
}
