import React, {useMemo, useState} from "react";
import {Text, TextProps, TouchableOpacity, View} from "react-native";
import {YT, YTNodes} from "../../utils/Youtube";
import useChannelData, {
  ChannelContentTypes,
} from "../../hooks/channel/useChannelData";
import Logger from "../../utils/Logger";
import SectionList from "./SectionList";
import {ButtonGroup} from "@rneui/base";
import _ from "lodash";
import {useAppStyle} from "../../context/AppStyleContext";
import GridView from "../GridView";
import {extractSectionList} from "../../extraction/ShelfExtraction";
import useGridColumnsPreferred from "../../hooks/home/useGridColumnsPreferred";

const LOGGER = Logger.extend("CHANNEL");

interface Props {
  channel: YT.Channel;
}

export default function Channel({channel}: Props) {
  const [selected, setSelected] = useState<ChannelContentTypes>("Home");
  const {style} = useAppStyle();
  const buttons = useMemo(
    () =>
      _.compact([
        {
          element: ({isSelected}: {isSelected?: boolean}) => (
            <ChannelBtnText isSelected={isSelected}>Home</ChannelBtnText>
          ),
          key: "Home" as ChannelContentTypes,
        },
        channel.has_videos
          ? {
              element: ({isSelected}: {isSelected?: boolean}) => (
                <ChannelBtnText isSelected={isSelected}>Videos</ChannelBtnText>
              ),
              key: "Videos" as ChannelContentTypes,
            }
          : null,
        channel.has_shorts
          ? {
              element: ({isSelected}: {isSelected?: boolean}) => (
                <ChannelBtnText isSelected={isSelected}>Reels</ChannelBtnText>
              ),
              key: "Reels" as ChannelContentTypes,
            }
          : null,
        channel.has_playlists
          ? {
              element: ({isSelected}: {isSelected?: boolean}) => (
                <ChannelBtnText isSelected={isSelected}>
                  Playlists
                </ChannelBtnText>
              ),
              key: "Playlists" as ChannelContentTypes,
            }
          : null,
      ]),
    [channel],
  );

  return (
    <View style={{flex: 1}}>
      <ButtonGroup
        Component={TouchableOpacity}
        selectedIndex={buttons.findIndex(value => value.key === selected)}
        buttons={buttons}
        onPress={e => setSelected(buttons[e as number].key ?? "Home")}
        selectedButtonStyle={{backgroundColor: "lightblue"}}
        buttonContainerStyle={{borderColor: "#555555"}}
        containerStyle={{backgroundColor: "#333333"}}
        buttonStyle={{backgroundColor: "#555555"}}
      />
      <View style={{flex: 1}}>
        {channel.has_home && selected === "Home" ? (
          <ChannelRow channel={channel} type={"Home"} />
        ) : null}
        {channel.has_videos && selected === "Videos" ? (
          <ChannelRow channel={channel} type={"Videos"} />
        ) : null}
        {channel.has_shorts && selected === "Reels" ? (
          <ChannelRow channel={channel} type={"Reels"} />
        ) : null}
        {channel.has_playlists && selected === "Playlists" ? (
          <ChannelRow channel={channel} type={"Playlists"} />
        ) : null}
      </View>
    </View>
  );
}

interface RowProps {
  channel: YT.Channel;
  type: ChannelContentTypes;
}

function ChannelRow({channel, type}: RowProps) {
  const {data, nodes, fetchMore} = useChannelData(channel, type);
  const columns = useGridColumnsPreferred(type === "Reels");

  // LOGGER.debug(data ? recursiveTypeLogger([data.page_contents]) : "");

  if (data?.page_contents && data.page_contents.is(YTNodes.SectionList)) {
    return <SectionList node={extractSectionList(data.page_contents)} />;
  } else if (Array.isArray(nodes)) {
    return (
      <GridView
        shelfItem={nodes}
        onEndReached={() => fetchMore()}
        // TODO: Optimize
        columns={type === "Playlists" ? undefined : columns}
      />
    );
  } else {
    LOGGER.warn("Unsupported Channel Type: ", data?.page_contents);
  }

  return (
    <View>
      <Text>Unsupported Channel Type</Text>
    </View>
  );
}

interface ChannelBtnTextProps {
  children: TextProps["children"];
  isSelected?: boolean;
}

function ChannelBtnText({children, isSelected}: ChannelBtnTextProps) {
  return (
    <Text style={{color: isSelected ? "black" : "white", fontSize: 22}}>
      {children}
    </Text>
  );
}
