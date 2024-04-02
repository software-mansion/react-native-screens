import React from "react";
import {Platform, StyleProp, TextStyle, ViewStyle} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackProp, RootRouteProp} from "../../navigation/types";
import PlaylistCardTV from "./tv/PlaylistCardTV";
import {Author, Thumbnail} from "../../extraction/Types";
import PlaylistCardPhone from "./phone/PlaylistCardPhone";
import DeviceInfo from "react-native-device-info";

interface Props {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  playlistId: string;
  title: string;
  videoCount?: string;
  thumbnail?: Thumbnail;
  author?: Author;
}

export default function PlaylistCard({...data}: Props) {
  const navigation = useNavigation<NativeStackProp>();
  const route = useRoute<RootRouteProp>();

  const onPress = () => {
    if (route.name === "PlaylistScreen") {
      navigation.replace("PlaylistScreen", {playlistId: data.playlistId});
    } else {
      navigation.navigate("PlaylistScreen", {
        playlistId: data.playlistId,
      });
    }
  };

  if (Platform.isTV) {
    return (
      <PlaylistCardTV
        {...data}
        author={data.author?.name}
        thumbnailURL={data.thumbnail?.url}
        onPress={onPress}
      />
    );
  }

  return <PlaylistCardPhone {...data} onPress={onPress} />;
}
