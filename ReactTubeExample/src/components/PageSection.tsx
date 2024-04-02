import React from "react";
import {YTNodes, Helpers} from "../utils/Youtube";
import Logger from "../utils/Logger";
import PageSectionList from "./segments/PageSectionList";
import PageSegment from "./PageSegment";
import GridView from "./GridView";

const LOGGER = Logger.extend("PAGE");

interface Props {
  node: Helpers.YTNode;
}

export default function PageSection({node}: Props) {
  if (node.is(YTNodes.RichShelf)) {
    return (
      <PageSectionList headerText={node.title.text} content={node.contents} />
    );
  } else if (node.is(YTNodes.ReelShelf)) {
    return (
      <PageSectionList headerText={node.title.text} content={node.contents} />
    );
  } else if (node.is(YTNodes.Shelf) && node.content?.is(YTNodes.VerticalList)) {
    return (
      <PageSectionList
        headerText={node.title.text}
        content={node.content.contents}
      />
    );
  } else if (
    node.is(YTNodes.Shelf) &&
    node.content?.is(YTNodes.HorizontalList)
  ) {
    return (
      <PageSectionList
        headerText={node.title.text}
        content={node.content.contents}
      />
    );
  } else if (node.is(YTNodes.Shelf) && node.content?.is(YTNodes.Grid)) {
    // TODO: Fix for Subscription Screen
    return (
      <PageSectionList
        headerText={node.title.text}
        content={node.content.contents}
      />
    );
  } else if (node.is(YTNodes.PlaylistVideoList)) {
    //TODO: Use Vertical List?
    return <GridView shelfItem={node.videos} onEndReached={() => {}} />;
  } else if (node.is(YTNodes.Video)) {
    //TODO: Use Vertical List?
    return <PageSegment segment={node} />;
  } else {
    LOGGER.info("Unknown PageSection type: ", node.type);
  }
  return null;
}
