import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from "react-native";
import FastImage from "react-native-fast-image";
import {useAppStyle} from "../../../context/AppStyleContext";
import {Author, Thumbnail} from "../../../extraction/Types";

interface Props {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  videoId: string;
  title: string;
  duration?: string;
  thumbnail?: Thumbnail;
  author?: Author;
  date?: string;
  disabled?: boolean;
  livestream?: boolean;
}

export default function ReelCardPhone({
  style,
  textStyle,
  onPress,
  ...data
}: Props) {
  const {style: appStyle} = useAppStyle();

  return (
    <View style={[styles.container, {width: 150}]}>
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={[
            styles.segmentContainer,
            {aspectRatio: 0.56, borderRadius: 25},
          ]}>
          <FastImage
            style={styles.imageStyle}
            resizeMode={"cover"}
            source={{
              uri:
                data.thumbnail?.url ??
                "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
            }}
          />
          {data.title ? (
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.titleStyle,
                  {color: appStyle.textColor},
                  textStyle,
                ]}>
                {data.title}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    marginVertical: 5,
    flex: 0,
    marginHorizontal: 10,
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
  titleStyle: {
    fontSize: 15,
    maxHeight: 50,
    flexWrap: "wrap",
    paddingEnd: 20,
  },
  titleContainer: {
    position: "absolute",
    left: 5,
    bottom: 5,
    right: 5,
    fontSize: 14,
  },
});
