import {Helpers} from "../utils/Youtube";
import {getVideoData} from "./ElementData";
import _ from "lodash";
import {parseHorizontalNode} from "./ShelfExtraction";

export function parseObservedArray(
  array: Helpers.ObservedArray<Helpers.YTNode>,
) {
  return _.chain(Array.from(array.values()))
    .map(getVideoData)
    .compact()
    .value();
}

export function parseObservedArrayHorizontalData(
  array: Helpers.ObservedArray<Helpers.YTNode>,
) {
  return _.chain(Array.from(array.values()))
    .map(parseHorizontalNode)
    .compact()
    .value();
}

export function parseObservedArrayHorizontalDataFlatMap(
  array: Helpers.ObservedArray<Helpers.YTNode>,
) {
  return _.chain(Array.from(array.values()))
    .map(parseHorizontalNode)
    .compact()
    .flatMap(v => {
      return v.data.map(parseHorizontalNode);
    })
    .compact()
    .value();
}
