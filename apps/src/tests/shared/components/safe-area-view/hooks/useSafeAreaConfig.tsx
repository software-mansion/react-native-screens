import React from "react";
import { SafeAreaConfigContext } from "../contexts/SafeAreaConfigContext";

export function useSafeAreaConfig() {
  const payload = React.useContext(SafeAreaConfigContext);

  if (payload == null) {
    throw new Error("[Test] Expected to be wrapped in SafeAreaConfigContext");
  }

  return payload;
}

