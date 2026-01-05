import React from "react";
import type { PopActionMethod, PreloadActionMethod, PushActionMethod } from "../StackContainerV2.types";

export type StackNavigationContextPayload = {
  routeKey: string;
  push: PushActionMethod,
  pop: PopActionMethod,
  preload: PreloadActionMethod,
};

export const StackNavigationContext = React.createContext<StackNavigationContextPayload | null>(null);

