import {Helpers, YTNodes} from "../utils/Youtube";
import _ from "lodash";
import {getVideoData} from "./ElementData";
import Logger from "../utils/Logger";
import {parseObservedArrayHorizontalData} from "./ArrayExtraction";
import {extractKeyNode} from "./KeyExtraction";
import {ElementData} from "./Types";

const LOGGER = Logger.extend("SHELF-EXTRACTION");

const firstRows = 2;

const videoItems = ["RichItem", "Video"];
const sectionItems = ["RichSection", "Shelf", "ReelShelf", "ItemSection"];

export interface HorizontalData {
  originalNode: Helpers.YTNode;
  data: Helpers.YTNode[];
  parsedData: ElementData[];
  loadMore: () => void;
  id: string;
  title?: string;
}

export function gridCalculatorExtract(
  content: Helpers.YTNode,
  columns: number,
) {
  return gridCalculator(extractListContent(content), columns);
}

export function gridCalculator(
  content: Helpers.YTNode[],
  columns: number,
): (ElementData[] | HorizontalData)[] {
  console.log("TypesArr: ", listPrintTypes(content));

  const groups = _.groupBy(content, node => node.type);

  const types = Object.keys(groups);
  console.log("Types: ", types);

  const sectionsAvailable = _.intersection(types, sectionItems);

  if (sectionsAvailable.length > 0) {
    console.log("Sections Found");
    const items = _.chain(videoItems)
      .intersection(types)
      .map(type => (type ? groups[type] : []))
      .flatten()
      .map(getVideoData)
      .compact()
      .value();
    const sectionsItems = _.chain(sectionItems)
      .intersection(types)
      .map(type => (type ? groups[type] : []))
      .flatten()
      .map(parseHorizontalNode)
      .compact()
      .value();

    const newArray = [];

    for (const sections of sectionsItems) {
      for (let i = 0; i < firstRows; i++) {
        newArray.push(items.splice(0, columns));
      }
      newArray.push(sections);
    }
    newArray.push(..._.chunk(items, columns));

    return newArray;
  } else {
    const list = _.chain(content)
      .map(getVideoData)
      .filter(v => v !== undefined)
      .chunk(columns)
      .value() as ElementData[][];

    listPrint(list);

    return list;
  }
}

export function parseHorizontalNode(
  node: Helpers.YTNode,
): HorizontalData | undefined {
  if (!node) {
    LOGGER.warn("FALSE TYPE PROVIDED!");
    return undefined;
  }
  if (node.is(YTNodes.Shelf)) {
    const {content, parsedData} = node.content
      ? extractContent(node.content)
      : {content: [], parsedData: []};
    return {
      data: content,
      parsedData,
      loadMore: () => {},
      id: extractKeyNode(node),
      originalNode: node,
      title: node.title.text,
    };
  } else if (node.is(YTNodes.ItemSection)) {
    const {content, parsedData} = extractContent(Array.from(node.contents));

    // TODO: Currently producing warnings in extractContent?
    // For Channel Homescreen
    if (content.length === 1 && parsedData.length === 0) {
      console.log("Nested Shelf?");
      console.log(node.header);
      return parseHorizontalNode(content[0]);
    }

    return {
      data: content,
      parsedData: parsedData,
      loadMore: () => {},
      id: extractKeyNode(node),
      originalNode: node,
      title: node.header ? extractHeader(node.header) : undefined,
    };
  } else if (node.is(YTNodes.RichShelf, YTNodes.ReelShelf)) {
    const {content, parsedData} = extractContent(Array.from(node.contents));
    return {
      data: content,
      parsedData: parsedData,
      loadMore: () => {},
      id: extractKeyNode(node),
      originalNode: node,
      title: node.title.text,
    };
  } else if (node.is(YTNodes.RichSection)) {
    return parseHorizontalNode(node.content);
  } else if (node.is(YTNodes.ReelShelf)) {
    const {content, parsedData} = extractContent(Array.from(node.contents));
    return {
      data: content,
      parsedData: parsedData,
      loadMore: () => {},
      id: extractKeyNode(node),
      originalNode: node,
      title: node.title.text,
    };
  } else {
    console.warn("ShelfExtraction: Unknown horizontal type: ", node.type);
  }
}

function extractContent(node: Helpers.YTNode | Helpers.YTNode[]) {
  const content = Array.isArray(node) ? node : extractListContent(node);
  const parsedData = _.chain(content).map(getVideoData).compact().value();
  return {
    content,
    parsedData,
  };
}

function extractListContent(node: Helpers.YTNode): Helpers.YTNode[] {
  if (
    node.is(YTNodes.VerticalList, YTNodes.HorizontalList, YTNodes.ReelShelf)
  ) {
    return Array.from(node.contents.values());
  } else if (node.is(YTNodes.Shelf)) {
    return node.content ? extractListContent(node.content) : [];
  } else if (node.is(YTNodes.Grid)) {
    // TODO: Replace by allowing to return multiple Horizontal Data's for nested Grids
    return Array.from(node.contents.values());
  } else {
    console.log("Unknown ListContent extraction type: ", node.type);
  }
  return [];
}

function extractHeader(node: Helpers.YTNode) {
  if (node.is(YTNodes.ItemSectionHeader)) {
    return node.title.toString();
  } else {
    console.warn("Unknown Header type: ", node.type);
  }
}

function listPrint(v: any): any {
  if (Array.isArray(v)) {
    return v.map((v2: any) => listPrint(v2));
  }
  return v?.originalNode?.type;
}

function listPrintTypes(v: Helpers.YTNode | Helpers.YTNode[]): any {
  if (Array.isArray(v)) {
    return v.map((v2: any) => listPrintTypes(v2));
  }
  return v.type;
}

// SectionList Extraction

export function extractSectionList(node: Helpers.YTNode) {
  if (node.is(YTNodes.SectionList)) {
    console.log(JSON.stringify(listPrintTypes(node), null, 4));
    return parseObservedArrayHorizontalData(node.contents);
  } else {
    LOGGER.warn("Unknown SectionList type: ", node.type);
  }
  return [];
}
