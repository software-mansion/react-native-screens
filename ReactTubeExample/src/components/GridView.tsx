import React, {useCallback} from "react";
import {Helpers} from "../utils/Youtube";
import {
  FlatList,
  FlatListProps,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import ShelfVideoSelectorProvider from "../context/ShelfVideoSelector";
import VideoMenu from "./general/VideoMenu";
import useGrid from "../hooks/home/useGrid";
import PageSectionList from "./segments/PageSectionList";
import VideoSegment from "./VideoSegment";

interface Props extends Omit<FlatListProps<any>, "renderItem" | "data"> {
  style?: StyleProp<ViewStyle>;
  shelfItem: Helpers.YTNode[];
  columns?: number;
  onEndReached?: () => void;
  onElementFocused?: () => void;
}

export default function GridView({
  shelfItem,
  onEndReached,
  style,
  columns,
  onElementFocused,
  ...props
}: Props) {
  const sorted = useGrid(shelfItem, columns);

  const renderItem = useCallback(({item}: {item: (typeof sorted)[number]}) => {
    if (Array.isArray(item)) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {item.map((v, index) => (
            <VideoSegment key={`${v.id}-${index}`} element={v} />
          ))}
        </View>
      );
    }
    return <PageSectionList headerText={item.title} content={item} />;
  }, []);
  const keyExtractor = useCallback(
    (item: (typeof sorted)[number], index: number) =>
      Array.isArray(item)
        ? `homeFeed-${item.map(v => v.id).join("#")}-${index}`
        : `homeFeed-${item.id}-${index}`,
    [],
  );

  return (
    <ShelfVideoSelectorProvider onElementFocused={onElementFocused}>
      <>
        <FlatList
          {...props}
          style={style}
          data={sorted}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            padding: Platform.isTV ? 20 : 0,
          }}
          onEndReachedThreshold={0.7}
          onEndReached={onEndReached}
        />
        <VideoMenu />
      </>
    </ShelfVideoSelectorProvider>
  );
}
