import React, {useEffect} from "react";
import {View, StyleProp, ViewStyle} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import {Icon} from "@rneui/base";

interface Props {
  style: StyleProp<ViewStyle>;
  playing: boolean;
}

export default function PlayPauseAnimation({playing, style}: Props) {
  const isPlaying = useSharedValue(true);
  const playButtonOpacity = useSharedValue(0);

  useEffect(() => {
    if (isPlaying.value === playing) {
      return;
    }
    isPlaying.value = playing;
    //
    playButtonOpacity.value = withSequence(
      withTiming(1),
      withDelay(1000, withTiming(0)),
    );
  }, [playing]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: playButtonOpacity.value,
    };
  });

  return (
    <View
      style={[
        {flex: 1, justifyContent: "center", alignItems: "center"},
        style,
      ]}>
      <Animated.View
        style={[
          {
            width: 75,
            height: 75,
            backgroundColor: "#111111cc",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          },
          containerStyle,
        ]}>
        <View>
          {isPlaying.value ? (
            <Icon size={50} name={"pause"} color={"#ffffffaa"} />
          ) : (
            <Icon
              size={50}
              type={"material-community"}
              name={"play"}
              color={"#ffffffaa"}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}
