import React from "react";
import {Helpers} from "../../utils/Youtube";
import {Platform, StyleSheet, Text, View} from "react-native";
import HorizontalVideoList from "../HorizontalVideoList";
import {useAppStyle} from "../../context/AppStyleContext";
import {HorizontalData} from "../../extraction/ShelfExtraction";

interface Props {
  headerText?: string;
  content: Helpers.YTNode[] | HorizontalData;
}

export default function PageSectionList({headerText, content}: Props) {
  const {style} = useAppStyle();

  if (Array.isArray(content)) {
    console.warn("PageSectionList: OLDWAY!");
  }

  return (
    <View>
      <Text
        style={[
          styles.textStyle,
          {color: style.textColor},
          !Platform.isTV ? {fontSize: 20} : undefined,
        ]}>
        {headerText}
      </Text>
      <HorizontalVideoList
        nodes={Array.isArray(content) ? content : content.parsedData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 25,
  },
});
