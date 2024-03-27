import React from "react";
import {Helpers} from "../utils/Youtube";
import {HorizontalData} from "../extraction/ShelfExtraction";
import PageSectionList from "./segments/PageSectionList";

interface Props {
  segment: Helpers.YTNode | HorizontalData;
}

export default function PageSegment({segment}: Props) {
  if (!(segment instanceof Helpers.YTNode)) {
    return <PageSectionList content={segment} headerText={segment.title} />;
  } else {
    console.error("Page Segment: OLD WAY!");
  }
  return null;
}
