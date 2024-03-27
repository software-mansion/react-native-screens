// TODO: Add Reel Video Screen

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/RootStackNavigator";
import Carousel from "react-native-reanimated-carousel";
import useVideoDetails from "../../hooks/useVideoDetails";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {YTNodes} from "youtubei.js";
import VideoComponent from "../../components/VideoComponent";
import ErrorComponent from "../../components/general/ErrorComponent";
import {useNavigation} from "@react-navigation/native";
import ChannelIcon from "../../components/video/ChannelIcon";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {runOnJS} from "react-native-reanimated";
import {useReelPlaylist} from "../../hooks/video/useReelPlaylist";
import PlayPauseAnimation from "../../components/video/phone/PlayPauseAnimation";

type Props = NativeStackScreenProps<RootStackParamList, "VideoScreen">;
type NProp = NativeStackNavigationProp<RootStackParamList, "VideoScreen">;

export default function ReelVideoScreen({route}: Props) {
  const {videoId, navEndpoint} = route.params;
  const {YTVideoInfo} = useVideoDetails(navEndpoint ?? videoId);
  const navigation = useNavigation<NProp>();

  const {width, height} = useWindowDimensions();

  const {elements, fetchMore} = useReelPlaylist(YTVideoInfo?.id);

  console.log("WatchNextIds: ", elements);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const playlistData = useMemo(() => {
    if (elements && YTVideoInfo) {
      return [YTVideoInfo.id, ...elements];
    }
    return undefined;
  }, [YTVideoInfo, elements]);

  const [context, setContext] = useState<number>(0);

  useEffect(() => {
    if (playlistData && context >= playlistData.length - 1) {
      console.log("Fetch next Videos");
      fetchMore();
    }
  }, [context, playlistData, fetchMore]);

  if (!playlistData) {
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

  return (
    <reelContext.Provider value={{selected: context}}>
      <Carousel
        loop={false}
        vertical
        width={width}
        height={height}
        data={playlistData}
        scrollAnimationDuration={1000}
        windowSize={5}
        onSnapToItem={index => {
          setContext(index);
          console.log("current index:", index);
        }}
        renderItem={({index, item}) => (
          <VideoItem videoId={item} index={index} />
        )}
      />
    </reelContext.Provider>
  );
}

interface ItemProps {
  videoId: string | YTNodes.NavigationEndpoint;
  index: number;
}

function VideoItem({videoId, index}: ItemProps) {
  const {
    YTVideoInfo,
    httpVideoURL,
    hlsManifestUrl,
    actionData,
    like,
    dislike,
    removeRating,
  } = useVideoDetails(videoId);

  const {bottom} = useSafeAreaInsets();

  const [paused, setPaused] = useState(false);

  const videoUrl = useMemo(
    () => hlsManifestUrl ?? httpVideoURL,
    [hlsManifestUrl, httpVideoURL],
  );

  const {selected} = useContext(reelContext);

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

  const gesture = Gesture.Tap().onStart(() => {
    runOnJS(setPaused)(!paused);
  });

  // TODO: Add animation for pause
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.videoContainer}>
        <VideoComponent
          url={videoUrl}
          style={[styles.videoComponentFullscreen]}
          videoInfo={YTVideoInfo}
          fullscreen={false}
          paused={paused || selected !== index}
          controls={false}
          repeat={true}
          resizeMode={"cover"}
        />
        <PlayPauseAnimation
          playing={!paused}
          style={styles.pauseContainerStyle}
        />
        <View style={[styles.videoInfoContainer, {marginBottom: bottom + 3}]}>
          <View style={styles.videoChannelContainer}>
            <ChannelIcon
              channelId={YTVideoInfo.channel_id ?? ""}
              imageStyle={styles.videoChannelIcon}
            />
            <Text style={styles.videoChannelTitle}>
              {YTVideoInfo.channel?.name}
            </Text>
          </View>
          <Text style={styles.videoTitle}>{YTVideoInfo.title}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    borderWidth: 1,
    // backgroundColor: "red",
  },
  videoComponentFullscreen: {
    height: "100%",
    width: "100%",
    // marginTop: 30, // TODO: Check for Android?
  },
  videoInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: "10%",
    // backgroundColor: "#11111199",
    paddingHorizontal: 10,
  },
  videoChannelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  videoChannelTitle: {
    color: "white",
    fontSize: 17,
    marginStart: 5,
  },
  videoTitle: {
    color: "white",
    fontSize: 15,
  },
  videoChannelIcon: {
    width: 35,
    height: 35,
  },
  pauseContainerStyle: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

interface ReelContext {
  selected?: number;
}

const reelContext = createContext<ReelContext>({});
