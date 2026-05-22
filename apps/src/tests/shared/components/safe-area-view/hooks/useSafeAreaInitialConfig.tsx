import React from "react";
import { SafeAreaConfigContextPayload } from "../contexts/SafeAreaConfigContext";

export function useSafeAreaInitialConfig(initialState?: {
  isLeftEnabled?: boolean,
  isTopEnabled?: boolean,
  isRightEnabled?: boolean,
  isBottomEnabled?: boolean,
}) {
  const [isLeftEnabled, setIsLeftEnabled] = React.useState(initialState?.isLeftEnabled ?? false);
  const [isTopEnabled, setIsTopEnabled] = React.useState(initialState?.isTopEnabled ?? false);
  const [isRightEnabled, setIsRightEnabled] = React.useState(initialState?.isRightEnabled ?? false);
  const [isBottomEnabled, setIsBottomEnabled] = React.useState(initialState?.isBottomEnabled ?? false);

  const contextPayload: SafeAreaConfigContextPayload = React.useMemo(() => {
    return {
      props: {
        edges: {
          left: isLeftEnabled,
          top: isTopEnabled,
          right: isRightEnabled,
          bottom: isBottomEnabled,
        },
      },
      mutations: {
        toggleLeft: setIsLeftEnabled,
        toggleTop: setIsTopEnabled,
        toggleRight: setIsRightEnabled,
        toggleBottom: setIsBottomEnabled,
      }
    }
  }, [isLeftEnabled, isTopEnabled, isRightEnabled, isBottomEnabled]);

  return contextPayload;
}
