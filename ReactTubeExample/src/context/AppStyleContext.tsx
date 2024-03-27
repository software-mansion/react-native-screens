import React, {createContext, useContext} from "react";

type StyleType = "dark" | "light";

interface AppStyle {
  textColor: string;
  invertedTextColor: string;
  backgroundColor: string;
  backgroundColorAlpha: string;
}

const dark: AppStyle = {
  textColor: "white",
  invertedTextColor: "black",
  backgroundColor: "black",
  backgroundColorAlpha: "#111111cc",
};

interface AppStyleContext {
  type: StyleType;
  style: AppStyle;
}

const Context = createContext<AppStyleContext>({
  style: dark,
  type: "dark",
});

interface Props {
  children?: React.ReactNode;
}

export default function AppStyleProvider({children}: Props) {
  const value: AppStyleContext = {
    type: "dark",
    style: dark,
  };

  return <Context.Provider value={value} children={children} />;
}

export function useAppStyle() {
  return useContext(Context);
}
