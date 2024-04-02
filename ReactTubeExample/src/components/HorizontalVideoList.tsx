import React, {useCallback} from "react";
import {FlatList, StyleProp, TextStyle} from "react-native";
import {Helpers, YTNodes} from "../utils/Youtube";
import VideoSegment from "./VideoSegment";
import Logger from "../utils/Logger";
import {keyExtractorItems} from "../utils/YTNodeKeyExtractor";
import ChannelSegment from "./ChannelSegment";

import {ElementData} from "../extraction/Types";

const LOGGER = Logger.extend("SEGMENT");

interface Props {
  textStyle?: StyleProp<TextStyle>;
  nodes: (Helpers.YTNode | ElementData)[];
  onEndReached?: () => void;
}

export default function HorizontalVideoList({
  nodes,
  textStyle,
  onEndReached,
}: Props) {
  const renderItem = useCallback(
    ({item}: {item: Helpers.YTNode | ElementData}) => {
      if (!(item instanceof Helpers.YTNode)) {
        if (item.type === "channel") {
          return <ChannelSegment element={item.originalNode} />;
        } else {
          return <VideoSegment element={item} textStyle={textStyle} />;
        }
      } else {
        console.error("! Old Way Horizontal List");
        if (item.is(YTNodes.RichItem)) {
          return <VideoSegment element={item.content} textStyle={textStyle} />;
        } else if (item.is(YTNodes.Video)) {
          return <VideoSegment element={item} textStyle={textStyle} />;
        } else if (item.is(YTNodes.GridVideo)) {
          return <VideoSegment element={item} textStyle={textStyle} />;
        } else if (item.is(YTNodes.CompactVideo)) {
          return <VideoSegment element={item} textStyle={textStyle} />;
        } else if (item.is(YTNodes.ReelItem)) {
          return <VideoSegment element={item} textStyle={textStyle} />;
        } else if (item.is(YTNodes.PlaylistVideo)) {
          return <VideoSegment element={item} textStyle={textStyle} />;
        } else if (item.is(YTNodes.GridChannel)) {
          return <ChannelSegment element={item} />;
        } else {
          LOGGER.warn("Unknown Videolist type: ", item.type);
        }
      }
      return null;
    },
    [textStyle],
  );

  const keyExtractor = useCallback((item: Helpers.YTNode | ElementData) => {
    return item instanceof Helpers.YTNode ? keyExtractorItems(item) : item.id;
  }, []);

  return (
    <FlatList
      horizontal
      data={nodes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.7}
    />
  );
}
