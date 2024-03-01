import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {YT} from "../../utils/Youtube";
import {useAppStyle} from "../../context/AppStyleContext";
import ChannelIcon from "./ChannelIcon";

interface Props {
  videoInfos: YT.VideoInfo;
}

export default function VideoInfo({videoInfos}: Props) {
  const {style: appStyle} = useAppStyle();

  return (
    <View style={styles.container}>
      <Text style={[styles.titleStyle, {color: appStyle.textColor}]}>
        {videoInfos.basic_info.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleStyle: {
    fontSize: 20,
  },
});
