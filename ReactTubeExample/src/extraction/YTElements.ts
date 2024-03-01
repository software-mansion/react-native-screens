import {YT, YTNodes} from "../utils/Youtube";
import {YTChannel, YTChapter, YTVideoInfo} from "./Types";
import {getThumbnail} from "./Misc";
import _ from "lodash";
import {getVideoData} from "./ElementData";

export function getElementDataFromVideoInfo(videoInfo: YT.VideoInfo) {
  const thumbnail = videoInfo.basic_info.thumbnail
    ? videoInfo.basic_info.thumbnail
        .map(getThumbnail)
        .find(thumb => !thumb.url.endsWith("webp")) // Do not use webp for iOS!
    : undefined;

  const chapters = extractChaptersFromVideoInfo(videoInfo);

  return {
    originalData: videoInfo,
    id: videoInfo.basic_info.id,
    duration: videoInfo.basic_info.duration,
    livestream: videoInfo.basic_info.is_live,
    thumbnailImage: thumbnail,
    title: videoInfo.basic_info.title,
    description: videoInfo.basic_info.short_description,
    short_views:
      videoInfo.primary_info?.short_view_count.text ??
      videoInfo.primary_info?.view_count.text,
    publishDate: videoInfo.primary_info?.relative_date.text,
    chapters: chapters,
    channel_id:
      videoInfo.basic_info.channel_id ?? videoInfo.basic_info.channel?.id,
    channel: videoInfo.basic_info.channel,
    playlist: parseVideoInfoPlaylist(videoInfo),
    liked: videoInfo.basic_info.is_liked,
    disliked: videoInfo.basic_info.is_disliked,
  } as YTVideoInfo;
}

function parseVideoInfoPlaylist(videoInfo: YT.VideoInfo) {
  if (videoInfo.playlist) {
    const playlist = videoInfo.playlist;

    console.log("PlaylistData: ", JSON.stringify(videoInfo.playlist.contents));

    const content = _.chain(playlist.contents)
      .map(getVideoData)
      .compact()
      .value();

    return {
      id: videoInfo.playlist.id,
      title: videoInfo.playlist.title,
      current_index: videoInfo.playlist.current_index,
      is_infinite: videoInfo.playlist.is_infinite,
      // author: videoInfo.playlist.author,
      content: content,
    } as YTVideoInfo["playlist"];
  }
}

function extractChaptersFromVideoInfo(videoInfo: YT.VideoInfo) {
  const ytChapters = _.chain(
    videoInfo.player_overlays?.decorated_player_bar?.player_bar?.markers_map ??
      [],
  )
    .flatMap(c => c.value.chapters)
    .compact()
    .value();
  return ytChapters.length > 0 && videoInfo.basic_info.duration
    ? getChaptersFromData(ytChapters, videoInfo.basic_info.duration)
    : [];
}

export function getChaptersFromData(
  chapters: YTNodes.Chapter[],
  durationInMillis: number,
) {
  const parsed = chapters.map(getChapterFromData);

  parsed.forEach((chapter, index) => {
    if (index < parsed.length - 1) {
      parsed[index].endDuration = parsed[index + 1].startDuration;
    } else {
      parsed[index].endDuration = durationInMillis / 1000;
    }
  });

  return parsed;
}

export function getChapterFromData(
  chapter: YTNodes.Chapter,
  indexNumber: number,
) {
  const thumbnail = chapter.thumbnail
    .map(getThumbnail)
    .find(thumb => !thumb.url.endsWith("webp")); // Do not use webp for iOS!;
  return {
    originalData: chapter,
    title: chapter.title.text ?? `Chapter ${indexNumber}`,
    thumbnailImage: thumbnail,
    startDuration: chapter.time_range_start_millis / 1000,
    // Do not set endDuration as not known from single data
  } as YTChapter;
}

// YT.Channel

export function getElementDataFromYTChannel(channel: YT.Channel) {
  return {
    originalData: channel,
    id: channel.metadata.external_id,
    title: channel.title,
    description: channel.metadata.description,
  } as YTChannel;
}
