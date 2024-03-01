import React, {createContext, useContext} from "react";

interface ContextState {
  onScreenFocused?: () => void;
}

const defState: ContextState = {
  onScreenFocused: () => console.warn("No Provider defined!"),
};

const context = createContext<ContextState>(defState);

interface Props {
  children: React.ReactNode;
  onScreenFocused?: () => void;
}

export default function DrawerContextProvider({
  children,
  onScreenFocused,
}: Props) {
  return <context.Provider value={{onScreenFocused}} children={children} />;
}

export function useDrawerContext() {
  return useContext(context);
}
