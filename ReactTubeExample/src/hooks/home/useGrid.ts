import {useWindowDimensions} from "react-native";
import {useMemo} from "react";
import {gridCalculator} from "../../extraction/ShelfExtraction";
import {Helpers} from "../../utils/Youtube";

export default function useGrid(content: Helpers.YTNode[], column?: number) {
  const {width} = useWindowDimensions();

  console.log("Width: ", width);

  const list = useMemo(() => {
    const columnCount = column ?? Math.max(Math.floor(width / 500), 1);

    return gridCalculator(content, columnCount);
  }, [content, width, column]);

  console.log(
    "useGrid: ",
    list.map(v => listPrint(v)),
  );

  return list;
}

function listPrint(v: any): any {
  if (Array.isArray(v)) {
    return v.map((v2: any) => listPrint(v2));
  }
  return v?.originalNode?.type;
}
