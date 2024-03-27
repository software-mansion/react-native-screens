import {useMemo} from "react";
import {Platform, useWindowDimensions} from "react-native";
import DeviceInfo from "react-native-device-info";

export default function useGridColumnsPreferred(reels?: boolean) {
  const {width} = useWindowDimensions();

  return useMemo(() => {
    if (Platform.isTV) {
      return undefined;
    } else if (DeviceInfo.isTablet()) {
      return Math.max(Math.floor(width / (reels ? 175 : 375)), 2);
    } else if (!DeviceInfo.isTablet() && reels) {
      // Phone grids only on reels
      return Math.floor(width / 175);
    }
  }, [width, reels]);
}
