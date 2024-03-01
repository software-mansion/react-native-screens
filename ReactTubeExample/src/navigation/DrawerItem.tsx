import React, {useEffect, useRef} from "react";
import {
  DrawerContentComponentProps,
  DrawerItem as OriginalDrawerItem,
  useDrawerProgress,
} from "@react-navigation/drawer";
import {findNodeHandle, TouchableOpacity} from "react-native";
import {runOnJS, SharedValue, useDerivedValue} from "react-native-reanimated";

interface Props
  extends React.ComponentPropsWithoutRef<typeof OriginalDrawerItem> {
  navigation: DrawerContentComponentProps["navigation"];
}

export default function DrawerItem(props: Props) {
  const ref = useRef<TouchableOpacity>(null);
  const progress: SharedValue<number> = useDrawerProgress();

  const focus = () => {
    ref.current?.focus?.();
  };

  // useDerivedValue(() => {
  //   if (props.focused && progress.value === 1) {
  //     console.log("Process 1");
  //     // runOnJS(focus)();
  //   }
  // }, [progress]);

  useEffect(() => {
    if (props.focused) {
      console.log("Set focus");
      setTimeout(() => {
        console.log("Focus delayed");
        ref.current?.setNativeProps({focus: true});
      }, 2000);
    }
  }, []);

  return (
    <TouchableOpacity
      // @ts-ignore
      ref={ref}
      hasTVPreferredFocus={true}
      onPress={props.onPress}
      nextFocusLeft={findNodeHandle(ref.current) ?? undefined}
      nextFocusRight={findNodeHandle(ref.current) ?? undefined}>
      <OriginalDrawerItem {...props} />
    </TouchableOpacity>
  );
}
