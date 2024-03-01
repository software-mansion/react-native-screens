import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import FastImage from "react-native-fast-image";
import ChannelIcon from "../../video/ChannelIcon";
import {useAppStyle} from "../../../context/AppStyleContext";
import {Author, Thumbnail} from "../../../extraction/Types";
import {Icon} from "@rneui/base";

interface Props {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  playlistId: string;
  title: string;
  videoCount?: string;
  thumbnail?: Thumbnail;
  author?: Author;
}

export default function PlaylistCardPhone({
  style,
  textStyle,
  onPress,
  ...data
}: Props) {
  const {width} = useWindowDimensions();
  const {style: appStyle} = useAppStyle();

  return (
    <View style={[styles.container, {minWidth: 150, maxWidth: width}]}>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={[styles.segmentContainer]}>
          <FastImage
            style={styles.imageStyle}
            resizeMode={"cover"}
            source={{
              uri:
                data.thumbnail?.url ??
                "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
            }}
          />
          <View style={styles.bottomBorder}>
            <Icon name={"book"} color={"white"} />
          </View>
          {data.videoCount ? (
            <View style={styles.countContainer}>
              <Text style={styles.countStyle}>{data.videoCount} Videos</Text>
            </View>
          ) : null}
        </View>
      </TouchableNativeFeedback>
      <View style={styles.metadataContainer}>
        {data.author?.thumbnail ? (
          <ChannelIcon
            channelId={data.author?.id ?? ""}
            thumbnailUrl={data.author?.thumbnail.url}
            imageStyle={{width: 50, height: 50}}
          />
        ) : null}
        <View style={styles.titleContainer}>
          <Text
            style={[styles.titleStyle, {color: appStyle.textColor}, textStyle]}>
            {data.title}
          </Text>
          {data.author ? (
            <Text
              style={[
                styles.subtitleStyle,
                {color: appStyle.textColor},
              ]}>{`${data.author.name}`}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    marginVertical: 5,
    flex: 0,
  },
  segmentContainer: {
    backgroundColor: "#aaaaaa",
    // borderRadius: 25,
    overflow: "hidden",
    aspectRatio: 1.7,
    alignItems: "center",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    // backgroundColor: "grey", // TODO: REMOVE?
  },
  metadataContainer: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "purple",
  },
  titleContainer: {
    justifyContent: "flex-start",
    marginStart: 10,
    marginEnd: 10,
    // backgroundColor: "red",
    width: "85%",
  },
  titleStyle: {
    fontSize: 15,
    maxHeight: 50,
    flexWrap: "wrap",
    paddingEnd: 20,
  },
  subtitleStyle: {
    fontSize: 12,
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
  countContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  countStyle: {
    color: "white",
    fontSize: 15,
  },
});
