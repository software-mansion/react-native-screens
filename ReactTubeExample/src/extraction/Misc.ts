import {Misc} from "../utils/Youtube";
import {Thumbnail} from "./Types";

export function getThumbnail(thumbnail: Misc.Thumbnail) {
  return {
    height: thumbnail.height,
    width: thumbnail.width,
    url: thumbnail.url.split("?")[0],
  } as Thumbnail;
}
