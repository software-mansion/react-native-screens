import React, {useEffect, useRef} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PlayButton from "./PlayButton";
import useNextVideo from "../../../hooks/ui/useNextVideo";
import FastImage from "react-native-fast-image";
import {YTVideoInfo} from "../../../extraction/Types";

interface NextVideoProps {
  nextVideo?: YTVideoInfo;
  onPress?: (id: string) => void;
}

export default function NextVideo({nextVideo, onPress}: NextVideoProps) {
  const {countdown} = useNextVideo(() => {
    console.log("Next Video triggered");
    nextVideo && onPress?.(nextVideo.id);
  });

  console.log("count", countdown);

  // TODO: Optimize image for end-card

  return (
    <View style={styles.container}>
      <Text style={styles.nextVideoText}>{"Next Video in " + countdown}</Text>
      <Text style={styles.videoTitle}>{nextVideo?.title}</Text>
      <FastImage
        style={styles.imageContainer}
        source={{uri: nextVideo?.thumbnailImage?.url}}
      />
      <PlayButton
        style={styles.playStyle}
        onPress={() => nextVideo && onPress?.(nextVideo.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextVideoText: {
    color: "white",
    fontSize: 25,
  },
  videoTitle: {
    color: "white",
    fontSize: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    width: 400,
    height: 200,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playStyle: {
    width: "30%",
    marginTop: 20,
  },
});
