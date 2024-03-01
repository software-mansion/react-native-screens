import React from "react";
import {useShelfVideoSelector} from "../../../context/ShelfVideoSelector";
import {useAppStyle} from "../../../context/AppStyleContext";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import VideoTouchable from "../../general/VideoTouchable";
import FastImage from "react-native-fast-image";
import {Icon} from "@rneui/base";
import {Author} from "../../../extraction/Types";

interface Props {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  videoId: string;
  title: string;
  views?: string;
  duration?: string;
  thumbnailURL?: string;
  author?: Author;
  date?: string;
  disabled?: boolean;
  livestream?: boolean;
  mix?: boolean;
}

export default function VideoCardTV({
  style,
  textStyle,
  onPress,
  ...data
}: Props) {
  const {setSelectedVideo, onElementFocused} = useShelfVideoSelector();
  const {style: appStyle} = useAppStyle();
  const {width} = useWindowDimensions();

  return (
    <View
      style={[
        styles.viewContainer,
        {minWidth: 150, maxWidth: width / 4},
        style,
      ]}>
      <VideoTouchable
        // onFocus={() => console.log("Focus")}
        style={styles.segmentContainer}
        onPress={onPress}
        onFocus={onElementFocused}
        onLongPress={() => {
          setSelectedVideo(data.videoId);
        }}>
        <FastImage
          style={styles.imageStyle}
          source={{
            uri:
              data.thumbnailURL ??
              "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
          }}
        />
        {data.duration ? (
          <Text style={styles.countContainer}>{data.duration}</Text>
        ) : null}
        {data.livestream ? (
          <View style={styles.liveContainer}>
            <Icon name={"record"} type={"material-community"} color={"red"} />
            <Text style={styles.liveStyle}>Live</Text>
          </View>
        ) : null}
        {data.mix ? (
          <View style={styles.bottomBorder}>
            <Icon name={"playlist-play"} color={"white"} />
          </View>
        ) : null}
      </VideoTouchable>
      <Text style={[styles.titleStyle, {color: appStyle.textColor}, textStyle]}>
        {data.title}
      </Text>
      {data.author ? (
        <Text style={[{color: appStyle.textColor}, textStyle]}>
          {data.author?.name}
        </Text>
      ) : null}
      {data.views ? (
        <Text
          style={[styles.viewsStyle, {color: appStyle.textColor}, textStyle]}>
          {data.views}
        </Text>
      ) : null}
      {data.date ? (
        <Text style={[{color: appStyle.textColor}, textStyle]}>
          {data.date}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: 20,
    flex: 0,
  },
  segmentContainer: {
    backgroundColor: "#aaaaaa",
    borderRadius: 25,
    overflow: "hidden",
    aspectRatio: 1.7,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey", // TODO: REMOVE?
  },
  titleStyle: {
    fontSize: 25,
    maxWidth: "100%",
  },
  viewsStyle: {},
  countContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
    color: "white",
    backgroundColor: "black",
    padding: 5,
    fontSize: 20,
  },
  liveContainer: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "black",
    padding: 5,
    fontSize: 20,
    flexDirection: "row",
  },
  liveStyle: {
    fontSize: 20,
    color: "red",
  },
  bottomBorder: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: "20%",
    backgroundColor: "#111111bb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
});
