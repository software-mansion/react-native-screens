import {Helpers, YTNodes} from "./Youtube";

export function recursiveTypeLogger(nodes: Helpers.YTNode[]): string {
  const value = recursiveTypeResolver(nodes);
  return JSON.stringify(value, null, 4);
}

function recursiveTypeResolver(nodes: Helpers.YTNode[]): any {
  return nodes.map(node => {
    if (!node) {
      return "undefined";
    } else if (node.is(YTNodes.SectionList)) {
      return {type: node.type, content: recursiveTypeResolver(node.contents)};
    } else if (node.is(YTNodes.ItemSection)) {
      return node.contents
        ? {type: node.type, content: recursiveTypeResolver(node.contents)}
        : node.type;
    } else if (node.is(YTNodes.Shelf)) {
      return node.content
        ? {type: node.type, content: recursiveTypeResolver([node.content])}
        : node.type;
    } else if (node.is(YTNodes.ExpandedShelfContents)) {
      return {type: node.type, content: recursiveTypeResolver(node.contents)};
    } else if (node.is(YTNodes.HorizontalList)) {
      return node.contents
        ? {type: node.type, content: recursiveTypeResolver(node.contents)}
        : node.type;
    } else if (node.is(YTNodes.PlaylistVideoList)) {
      return node.videos
        ? {
            type: node.type,
            content: recursiveTypeResolver(Array.from(node.videos.values())),
          }
        : node.type;
    } else {
      return node.type;
    }
  });
}
