import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import {clamp} from "react-native-redash";
import {useAppStyle} from "../../context/AppStyleContext";

export interface Progress {
  currentTime: number;
  currentTimeString: string;
  duration: number;
  durationString: string;
  position: number;
  remainingTime: number;
}

export interface Chapter {
  thumbnail?: string;
  title: string;
  startTime: number;
  endTime: number;
}

interface Props {
  progressValue: SharedValue<Progress | undefined>;
  durationString: string;
  currentString: string;
  chapters?: Chapter[];
}

export default function VideoProgressBar({
  progressValue,
  currentString,
  durationString,
}: Props) {
  const {style: appStyle} = useAppStyle();

  const width = useDerivedValue(() => {
    const position = progressValue.value?.position
      ? progressValue.value?.position * 100
      : 0;
    // console.log("Position: ", position);
    return clamp(position, 1, 99);
  }, [progressValue]);

  const style = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: "red",
    alignSelf: "flex-start",
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
  }));

  // console.log("CurrentText: ", currentString);

  // TODO: Add chapters to progress bar

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Animated.View style={style}>
          <View style={styles.barButton} />
        </Animated.View>
      </View>
      <Text style={[styles.durationText, {color: appStyle.textColor}]}>
        {durationString}
      </Text>
      <Text style={[styles.currentText, {color: appStyle.textColor}]}>
        {currentString}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  bar: {
    backgroundColor: "grey",
    borderRadius: 25,
    width: "95%",
    height: 10,
    alignSelf: "center",
  },
  barButton: {
    backgroundColor: "yellow",
    height: 20,
    width: 20,
    borderRadius: 25,
    alignSelf: "flex-end",
    transform: [
      {
        translateY: 0,
      },
    ],
  },
  durationText: {
    position: "absolute",
    right: 25,
    top: 10,
  },
  currentText: {
    position: "absolute",
    left: 10,
    top: 10,
  },
});
