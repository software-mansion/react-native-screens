import React from "react";
import {Text, View} from "react-native";
import useSubscriptions from "../hooks/useSubscriptions";
import GridView from "../components/GridView";

export default function SubscriptionScreen() {
  const {content, fetchMore} = useSubscriptions();

  return (
    <View>
      <Text>Subscription</Text>
      <GridView
        shelfItem={content}
        onEndReached={() => fetchMore().catch(console.warn)}
      />
    </View>
  );
}
