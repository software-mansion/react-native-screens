import React, {createContext, useContext} from "react";
import useYoutube from "../hooks/useYoutube";

const Context = createContext<ReturnType<typeof useYoutube> | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

export default function YoutubeContextProvider({children}: Props) {
  const youtube = useYoutube();

  return <Context.Provider value={youtube}>{children}</Context.Provider>;
}

export function useYoutubeContext() {
  return useContext(Context);
}
