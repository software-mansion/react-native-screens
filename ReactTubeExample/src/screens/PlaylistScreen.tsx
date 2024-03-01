import React from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/RootStackNavigator";
import {Platform, Text, View} from "react-native";
import LoadingComponent from "../components/general/LoadingComponent";
import usePlaylistDetails from "../hooks/usePlaylistDetails";
import Logger from "../utils/Logger";
import {recursiveTypeLogger} from "../utils/YTNodeLogger";
import {useAppStyle} from "../context/AppStyleContext";
import GridView from "../components/GridView";

const LOGGER = Logger.extend("PLAYLIST");

type Props = NativeStackScreenProps<RootStackParamList, "PlaylistScreen">;

export default function PlaylistScreen({route}: Props) {
  const {playlistId} = route.params;
  const {playlist, data, fetchMore} = usePlaylistDetails(playlistId);

  const {style} = useAppStyle();

  if (!playlist) {
    return <LoadingComponent />;
  }

  LOGGER.debug("Playlist: ", recursiveTypeLogger([playlist.page_contents]));

  return (
    <View style={{margin: Platform.isTV ? 20 : 0, flex: 1}}>
      <Text
        style={[{fontSize: Platform.isTV ? 25 : 20, color: style.textColor}]}>
        {playlist.info.title}
      </Text>
      <Text style={{fontSize: Platform.isTV ? 20 : 15, color: style.textColor}}>
        {playlist.info.last_updated}
      </Text>
      <GridView shelfItem={data} onEndReached={() => fetchMore()} />
    </View>
  );
}
