import React, {useState} from "react";
import {Pressable, StyleProp, ViewStyle, useTVEventHandler} from "react-native";

// TODO: Long Press not working always maybe use TVEvent instead?

type Props = {
  style?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
  onPress?: () => void;
  onFocus?: () => void;
  children: React.ReactNode;
};

export default function VideoTouchable({
  onLongPress,
  onPress,
  onFocus,
  children,
  style,
}: Props) {
  const [focus, setFocus] = useState(false);

  useTVEventHandler(event => {
    if (onLongPress && focus && event.eventType === "longSelect") {
      onLongPress();
    }
  });

  return (
    <Pressable
      onPress={() => {
        console.log("Press");
        onPress?.();
      }}
      onLongPress={() => console.log("LongPress")}
      onFocus={() => {
        setFocus(true);
        onFocus?.();
      }}
      onBlur={() => setFocus(false)}
      onPressIn={() => console.log("PressIn")}
      onPressOut={() => console.log("PressOut")}
      style={[style, {opacity: focus ? 0.5 : 1}]}>
      {children}
    </Pressable>
  );
}
