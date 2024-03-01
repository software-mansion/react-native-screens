import {Helpers, YTNodes} from "../utils/Youtube";
import Logger from "../utils/Logger";
import {
  ChannelData,
  ElementData,
  getAuthor,
  PlaylistData,
  VideoData,
} from "./Types";
import {getThumbnail} from "./Misc";

// TODO: Add ChannelData

// TODO: Split from ElementData in VideoData or PlaylistData

const skippedTypes = [
  // Movies are skipped
  YTNodes.GridMovie,
  YTNodes.Movie,
  // "CompactMovie", // No type available
];

const LOGGER = Logger.extend("EXTRACTION");

export function getVideoDataOfFirstElement(
  dataArr: Helpers.ObservedArray<Helpers.YTNode>,
) {
  const index = dataArr.findIndex(v => {
    return getVideoData(v) !== undefined;
  });
  return getVideoData(dataArr[index]);
}

// Exclude not supported formats? e.x. CompactMovies

// TODO: Rename to ElementData

export function getVideoData(ytNode: Helpers.YTNode): ElementData | undefined {
  if (!ytNode) {
    // LOGGER.warn("FALSE TYPE PROVIDED!");
    return undefined;
  }

  if (ytNode.is(...skippedTypes)) {
    LOGGER.debug("Skipping acknowledged type");
    return undefined;
  }

  // TODO: Maybe split
  if (ytNode.is(YTNodes.Video, YTNodes.CompactVideo)) {
    const duration = ytNode.duration.text;
    return {
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: ytNode.best_thumbnail
        ? getThumbnail(ytNode.best_thumbnail)
        : undefined,
      short_views: ytNode.short_view_count.toString(),
      author: getAuthor(ytNode.author),
      publishDate: ytNode.published.text,
      type: "video",
      duration: duration?.startsWith("N/A") ? undefined : duration,
      livestream: ytNode.is_live,
      originalNode: ytNode,
    } as VideoData;
  } else if (ytNode.is(YTNodes.GridVideo)) {
    return {
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      short_views: ytNode.short_view_count.toString(),
      author: ytNode.author ? getAuthor(ytNode.author) : undefined,
      publishDate: ytNode.published.text,
      type: "video",
      duration: ytNode.duration?.text,
      originalNode: ytNode,
    } as VideoData;
  } else if (ytNode.is(YTNodes.ReelItem)) {
    return {
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      short_views: ytNode.views.toString(),
      type: "reel",
      originalNode: ytNode,
    } as VideoData;
  } else if (ytNode.is(YTNodes.PlaylistVideo)) {
    return {
      type: "video",
      originalNode: ytNode,
      id: ytNode.id,
      navEndpoint: ytNode.endpoint,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
    } as VideoData;
  } else if (ytNode.is(YTNodes.PlaylistPanelVideo)) {
    return {
      type: "video",
      originalNode: ytNode,
      id: ytNode.video_id,
      navEndpoint: ytNode.endpoint,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnail[0]),
      duration: ytNode.duration.text,
    } as VideoData;
  }
  // Playlist Data
  else if (ytNode.is(YTNodes.GridPlaylist)) {
    return {
      type: "playlist",
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      author: ytNode.author ? getAuthor(ytNode.author) : undefined,
      originalNode: ytNode,
      videoCount: ytNode.video_count_short.text,
    } as PlaylistData;
  } else if (ytNode.is(YTNodes.Playlist)) {
    return {
      type: "playlist",
      originalNode: ytNode,
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      videoCount: ytNode.video_count_short.text,
    } as PlaylistData;
  } else if (ytNode.is(YTNodes.CompactPlaylist)) {
    return {
      type: "playlist",
      originalNode: ytNode,
      id: ytNode.id,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      videoCount: ytNode.video_count_short.text,
    } as PlaylistData;
  } else if (ytNode.is(YTNodes.CompactMix, YTNodes.Mix)) {
    return {
      type: "mix",
      originalNode: ytNode,
      id: ytNode.id,
      navEndpoint: ytNode.endpoint,
      title: ytNode.title.toString(),
      thumbnailImage: getThumbnail(ytNode.thumbnails[0]),
      videoCount: ytNode.video_count_short.text,
      short_views: ytNode.video_count_short.text,
    } as VideoData;
  }
  // Channel Data
  else if (ytNode.is(YTNodes.GridChannel)) {
    const author = getAuthor(ytNode.author);
    return {
      type: "channel",
      originalNode: ytNode,
      id: ytNode.id,
      author: author,
      title: author.name,
      thumbnailImage: author.thumbnail,
    } as ChannelData;
  }
  // Recursive Section
  else if (ytNode.is(YTNodes.RichItem)) {
    // Recursive extraction
    return getVideoData(ytNode.content);
  } else if (ytNode.is(YTNodes.ReelShelf)) {
    console.warn("ReelShelf Nav Endpoint: ", ytNode.endpoint);
    console.log("ReelShelf: ", ytNode.items);
  } else {
    LOGGER.warn("getVideoData: Unknown type: ", ytNode.type);
  }
}
