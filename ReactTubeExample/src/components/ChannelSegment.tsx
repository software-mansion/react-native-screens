import React from "react";
import {StyleProp, ViewStyle} from "react-native";
import {Helpers, YTNodes} from "../utils/Youtube";
import ChannelCard from "./ChannelCard";
import Logger from "../utils/Logger";

const LOGGER = Logger.extend("SEGMENT");

interface SegmentProps {
  style?: StyleProp<ViewStyle>;
  element: Helpers.YTNode;
}

export default function ChannelSegment({element}: SegmentProps) {
  if (element.is(YTNodes.GridChannel)) {
    const bestThumbnail = element.author.best_thumbnail?.url;
    const transformed = bestThumbnail
      ? "https://" + bestThumbnail.split("//")[1]
      : undefined;
    return (
      <ChannelCard
        id={element.id}
        channelName={element.author.name}
        imageUrl={transformed}
      />
    );
  } else {
    LOGGER.warn("Unknown Channel Segment type: ", element.type);
    return null;
  }
}
