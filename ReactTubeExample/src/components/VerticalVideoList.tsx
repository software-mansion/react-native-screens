import React, {useCallback} from "react";
import {FlatList, FlatListProps, StyleProp, TextStyle} from "react-native";
import {ElementData} from "../extraction/Types";
import ChannelSegment from "./ChannelSegment";
import VideoSegment from "./VideoSegment";

interface Props
  extends Omit<FlatListProps<ElementData>, "data" | "renderItem"> {
  textStyle?: StyleProp<TextStyle>;
  nodes: ElementData[];
  onEndReached?: () => void;
}

export default function VerticalVideoList({
  textStyle,
  nodes,
  onEndReached,
  ...props
}: Props) {
  const renderItem = useCallback(
    ({item}: {item: ElementData}) => {
      if (item.type === "channel") {
        return <ChannelSegment element={item.originalNode} />;
      } else {
        return <VideoSegment element={item} textStyle={textStyle} />;
      }
      return null;
    },
    [textStyle],
  );

  const keyExtractor = useCallback((item: ElementData) => {
    return item.id;
  }, []);

  return (
    <FlatList
      {...props}
      data={nodes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.7}
    />
  );
}
