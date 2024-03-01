import {YTNodes, Helpers} from "./Youtube";
import Logger from "./Logger";

const LOGGER = Logger.extend("YTNODE-KEYEXTRACTOR");

export function itemSectionExtractor(node: Helpers.YTNode): string {
  if (node.is(YTNodes.ItemSection)) {
    return node.contents
      ? itemSectionExtractor(node.contents[0])
      : "empty-item-section";
  } else if (node.is(YTNodes.Shelf)) {
    return node.title.text ?? "empty-title";
  } else if (node.is(YTNodes.ReelShelf)) {
    return node.title.text ?? "empty-title-reel";
  } else if (node.is(YTNodes.RecognitionShelf)) {
    return node.title.text ?? "empty-title-recognition-shelf";
  } else if (node.is(YTNodes.ChannelVideoPlayer)) {
    return node.id;
  } else if (node.is(YTNodes.PlaylistVideoList)) {
    return node.id;
  } else {
    LOGGER.warn("No item section key found for :", node.type);
  }
  return "";
}

export function keyExtractorItems(itemNode: Helpers.YTNode): string {
  if (itemNode.is(YTNodes.Video)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.ReelItem)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.GridVideo)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.CompactVideo)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.GridChannel)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.PlaylistVideo)) {
    return itemNode.id;
  } else if (itemNode.is(YTNodes.Movie)) {
    return itemNode.id;
  } else if (itemNode.type === "CompactMovie") {
    // Currently unknown type?
    // @ts-ignore
    return itemNode.id;
  } else if (itemNode.is(YTNodes.RichItem)) {
    return keyExtractorItems(itemNode.content);
  } else {
    LOGGER.debug("Unknown Video keyExtractor type: ", itemNode.type);
  }
  return "";
}
