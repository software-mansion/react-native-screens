import React, {useMemo} from "react";
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
import {Icon} from "@rneui/base";
import {useAppStyle} from "../../../context/AppStyleContext";
import ChannelIcon from "../../video/ChannelIcon";
import {Author, Thumbnail} from "../../../extraction/Types";
import _ from "lodash";

interface Props {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  videoId: string;
  title: string;
  views?: string;
  duration?: string;
  thumbnail?: Thumbnail;
  author?: Author;
  date?: string;
  disabled?: boolean;
  livestream?: boolean;
  mix?: boolean;
}

export default function VideoCardPhone({
  style,
  textStyle,
  imageContainerStyle,
  onPress,
  ...data
}: Props) {
  const {style: appStyle} = useAppStyle();
  const {width} = useWindowDimensions();

  const subtitleContent = useMemo(() => {
    return _.chain([data.author?.name, data.views, data.date])
      .compact()
      .value();
  }, [data]);

  return (
    <View style={[styles.container, {minWidth: 150, maxWidth: width}, style]}>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={[styles.segmentContainer, imageContainerStyle]}>
          <FastImage
            style={styles.imageStyle}
            resizeMode={"cover"}
            source={{
              uri:
                data.thumbnail?.url ??
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
          {subtitleContent.length > 0 ? (
            <Text style={[styles.subtitleStyle, {color: appStyle.textColor}]}>
              {subtitleContent.join(" · ")}
            </Text>
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
  countContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
    color: "white",
    backgroundColor: "black",
    padding: 5,
    fontSize: 15,
  },
  liveContainer: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "black",
    padding: 5,
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  liveStyle: {
    fontSize: 15,
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
