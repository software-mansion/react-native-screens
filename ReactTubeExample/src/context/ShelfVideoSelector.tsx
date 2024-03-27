import React, {createContext, useContext, useState} from "react";
import {YT} from "../utils/Youtube";

interface ShelfVideo {
  selectedVideo?: string;
}

interface ShelfVideoContext extends ShelfVideo {
  setSelectedVideo: (video?: string) => void;
  onElementFocused?: () => void;
}

const defaultValue: ShelfVideoContext = {
  setSelectedVideo: () => {},
};

const ShelfVideoContext = createContext<ShelfVideoContext>(defaultValue);

interface Props {
  children: React.ReactNode;
  onElementFocused?: () => void;
}

export default function ShelfVideoSelectorProvider({
  children,
  onElementFocused,
}: Props) {
  const [shelfData, setShelfData] = useState<ShelfVideo>({});

  const value: ShelfVideoContext = {
    ...shelfData,
    setSelectedVideo: video => {
      setShelfData({
        selectedVideo: video,
      });
    },
    onElementFocused,
  };

  return <ShelfVideoContext.Provider value={value} children={children} />;
}

export function useShelfVideoSelector() {
  return useContext(ShelfVideoContext);
}
