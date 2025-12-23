import React from "react";
import type { PopActionMethod, PushActionMethod } from "../StackContainerV2.types";

export type StackNavigationContextPayload = {
  routeKey: string;
  push: PushActionMethod,
  pop: PopActionMethod,
};

export const StackNavigationContext = React.createContext<StackNavigationContextPayload | null>(null);

