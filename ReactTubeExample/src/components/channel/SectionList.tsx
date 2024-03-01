import React, {useCallback} from "react";
import {FlatList, StyleProp, ViewStyle} from "react-native";
import PageSegment from "../PageSegment";
import {HorizontalData} from "../../extraction/ShelfExtraction";

interface Props {
  style?: StyleProp<ViewStyle>;
  node: HorizontalData[];
  onEndReached?: () => void;
}

export default function SectionList({node, ...otherProps}: Props) {
  console.log(node);

  return <ItemList nodes={node} {...otherProps} />;
}

interface ListProps {
  style?: StyleProp<ViewStyle>;
  nodes: HorizontalData[];
  onEndReached?: () => void;
}

function ItemList({nodes, style, onEndReached}: ListProps) {
  const renderItem = useCallback(
    ({item}: {item: HorizontalData}) => <PageSegment segment={item} />,
    [],
  );

  return (
    <FlatList
      style={{height: "100%"}}
      data={nodes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReachedThreshold={0.7}
      onEndReached={onEndReached}
    />
  );
}
