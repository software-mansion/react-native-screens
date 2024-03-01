import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import {useNavigation} from "@react-navigation/native";
import {NativeStackProp} from "../navigation/types";
import {useAppStyle} from "../context/AppStyleContext";

interface Props {
  id: string;
  channelName: string;
  imageUrl?: string;
}

export default function ChannelCard({id, channelName, imageUrl}: Props) {
  const {style} = useAppStyle();
  const navigation = useNavigation<NativeStackProp>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchContainer}
        onPress={() =>
          navigation.push("ChannelScreen", {
            channelId: id,
          })
        }>
        <FastImage
          style={styles.image}
          source={{
            uri:
              imageUrl ??
              "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
          }}
        />
        <Text style={[styles.text, {color: style.textColor}]}>
          {channelName}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: 200,
    height: 200,
  },
  touchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    marginTop: 20,
  },
});
