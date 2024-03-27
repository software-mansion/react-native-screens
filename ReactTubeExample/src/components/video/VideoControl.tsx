import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import {StyleProp, ViewStyle} from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
  show: SharedValue<boolean>;
  children: React.ReactNode;
}

export default function VideoControl({children, show, style}: Props) {
  const opacity = useDerivedValue(() => {
    return withTiming(show.value ? 100 : 0);
  }, [show]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity],
  );

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
