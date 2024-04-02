import React, {useEffect, useMemo, useState} from "react";
import VideoComponent from "../components/VideoComponent";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/RootStackNavigator";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useTVEventHandler,
  TVEventControl,
} from "react-native";
import useVideoDetails from "../hooks/useVideoDetails";
import EndCard from "../components/video/EndCard";
import LOGGER from "../utils/Logger";
import VideoPlayerVLC from "../components/video/VideoPlayerVLC";
import {useAppData} from "../context/AppDataContext";
import ErrorComponent from "../components/general/ErrorComponent";
import {useFocusEffect} from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "VideoScreen">;

interface PlaybackInformation {
  resolution: string;
}

// TODO: Fix if freeze if video does only provide audio!!
// TODO: Add TV remote input for suggestions https://github.com/react-native-tvos/react-native-tvos/blob/tvos-v0.64.2/README.md

export default function VideoScreen({route, navigation}: Props) {
  const {videoId, navEndpoint} = route.params;
  console.log("VideoID: ", videoId);
  console.log("NavEndpoint: ", navEndpoint);
  const {YTVideoInfo, httpVideoURL, hlsManifestUrl} = useVideoDetails(
    navEndpoint ?? videoId,
  );
  const [playbackInfos, setPlaybackInfos] = useState<PlaybackInformation>();
  const [showEndCard, setShowEndCard] = useState(false);
  // TODO: Workaround maybe replace with two components
  const [ended, setEnded] = useState(false);

  const {appSettings} = useAppData();

  // TODO: Will be replaced once embed server is available on tvOS
  const hlsUrl = useMemo(() => {
    return appSettings.localHlsEnabled
      ? `http://192.168.178.10:7500/video/${videoId}/master.m3u8`
      : undefined;
  }, [appSettings.localHlsEnabled, videoId]);

  useEffect(() => {
    return navigation.addListener("blur", () => {
      setShowEndCard(false);
    });
  }, [navigation]);

  useTVEventHandler(event => {
    LOGGER.debug("TV Event: ", event.eventType);
    if (event.eventType === "longDown" || event.eventType === "longSelect") {
      setEnded(false);
      setShowEndCard(true);
    }
  });

  useFocusEffect(() => {
    // Enable TV Menu Key to fix issue if video not loading
    TVEventControl.enableTVMenuKey();
  });

  const videoUrl = useMemo(
    () => hlsManifestUrl ?? httpVideoURL,
    [hlsManifestUrl, httpVideoURL],
  );

  if (!YTVideoInfo) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!videoUrl) {
    return (
      <ErrorComponent
        text={
          YTVideoInfo.originalData.playability_status.reason ??
          "Video source is not available"
        }
      />
    );
  }
  return (
    <View style={[StyleSheet.absoluteFill]}>
      {appSettings.vlcEnabled ? (
        <VideoPlayerVLC
          videoInfo={YTVideoInfo.originalData}
          url={videoUrl}
          hlsUrl={hlsUrl}
          onEndReached={() => {
            setEnded(true);
            setShowEndCard(true);
          }}
          disableControls={showEndCard}
        />
      ) : (
        <VideoComponent
          url={videoUrl}
          hlsUrl={hlsUrl}
          videoInfo={YTVideoInfo}
          onEndReached={() => {
            setEnded(true);
            setShowEndCard(true);
          }}
          onPlaybackInfoUpdate={infos => {
            setPlaybackInfos({resolution: infos.height.toString() + "p"});
          }}
        />
      )}
      <EndCard
        video={YTVideoInfo}
        visible={showEndCard}
        onCloseRequest={() => {
          console.log("Back pressed");
          setShowEndCard(false);
        }}
        endCard={ended}
        currentResolution={playbackInfos?.resolution}
      />
    </View>
  );
}
