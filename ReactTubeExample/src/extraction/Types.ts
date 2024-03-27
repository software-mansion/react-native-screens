import {Helpers, Misc, YT, YTNodes} from "../utils/Youtube";

export interface Thumbnail {
  url: string;
  height: number;
  width: number;
}

export type ElementData = VideoData | PlaylistData | ChannelData;

export interface VideoData {
  originalNode: Helpers.YTNode;
  type: "video" | "reel" | "mix";
  id: string;
  navEndpoint?: YTNodes.NavigationEndpoint;
  thumbnailImage: Thumbnail;
  title: string;
  duration?: string;
  short_views?: string;
  publishDate?: string;
  author?: Author;
  quality?: string;
  livestream?: boolean;
}

export interface Author {
  id: string;
  name: string;
  thumbnail: Thumbnail;
}

export interface PlaylistData {
  originalNode: Helpers.YTNode;
  type: "playlist";
  id: string;
  title: string;
  thumbnailImage: Thumbnail;
  author?: Author;
  videoCount?: string;
  videos?: string[];
}

export interface ChannelData {
  originalNode: Helpers.YTNode;
  type: "channel";
  id: string;
  title: string;
  thumbnailImage: Thumbnail;
  author?: Author;
}

// YT.* Types

export interface YTVideoInfo {
  originalData: YT.VideoInfo;
  id: string;
  thumbnailImage: Thumbnail;
  title: string;
  description?: string;
  duration?: string;
  short_views: string;
  publishDate?: string;
  quality?: string;
  livestream?: boolean;
  author?: Author;
  chapters?: YTChapter[];
  channel_id?: string;
  channel?: {
    id: string;
    name: string;
    url: string;
  };
  playlist?: {
    id: string;
    title: string;
    content: ElementData[];
    author?: string | Author;
    current_index: number;
    is_infinite: boolean;
  };
  liked?: boolean;
  disliked?: boolean;
}

export interface YTChapter {
  originalData: YTNodes.Chapter;
  title: string;
  thumbnailImage: Thumbnail;
  startDuration: number;
  endDuration: number;
}

export interface YTChannel {
  originalData: YT.Channel;
  id: string;
  title?: string;
  description?: string;
}

export function getAuthor(author: Misc.Author) {
  return {
    id: author.id,
    name: author.name,
    thumbnail: author.best_thumbnail,
  } as Author;
}
