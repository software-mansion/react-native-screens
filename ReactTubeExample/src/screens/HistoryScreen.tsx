import React from "react";
import {Text, View} from "react-native";
import useHistory from "../hooks/useHistory";
import GridView from "../components/GridView";

export default function HistoryScreen() {
  const {content, fetchMore} = useHistory();

  return (
    <View>
      <Text>History</Text>
      <GridView
        shelfItem={content}
        onEndReached={() => fetchMore().catch(console.warn)}
      />
    </View>
  );
}
