import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/RootStackNavigator";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import VideoComponent from "../../components/VideoComponent";
import useVideoDetails from "../../hooks/useVideoDetails";
import React, {useEffect, useMemo, useRef, useState} from "react";
import ErrorComponent from "../../components/general/ErrorComponent";
import VerticalVideoList from "../../components/VerticalVideoList";
import {parseObservedArray} from "../../extraction/ArrayExtraction";
import ChannelIcon from "../../components/video/ChannelIcon";
import {useAppStyle} from "../../context/AppStyleContext";
import Orientation, {
  ALL_ORIENTATIONS_BUT_UPSIDE_DOWN,
  OrientationLocker,
  useOrientationChange,
} from "react-native-orientation-locker";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useIsFocused} from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import GridView from "../../components/GridView";
import useGridColumnsPreferred from "../../hooks/home/useGridColumnsPreferred";
import PlaylistBottomSheet from "../../components/video/playlistBottomSheet/PlaylistBottomSheet";
import PlaylistBottomSheetContainer from "../../components/video/playlistBottomSheet/PlaylistBottomSheetContainer";
import BottomSheet from "@gorhom/bottom-sheet";
import {Icon} from "@rneui/base";
import {YTVideoInfo as YTVideoInfoType} from "../../extraction/Types";

type Props = NativeStackScreenProps<RootStackParamList, "VideoScreen">;

export default function VideoScreen({route, navigation}: Props) {
  const {videoId, navEndpoint} = route.params;
  const {
    YTVideoInfo,
    httpVideoURL,
    hlsManifestUrl,
    actionData,
    like,
    dislike,
    removeRating,
  } = useVideoDetails(navEndpoint ?? videoId);

  const {style} = useAppStyle();

  const [showEndCard, setShowEndCard] = useState(false);
  // TODO: Workaround maybe replace with two components
  const [ended, setEnded] = useState(false);

  const videoUrl = useMemo(
    () => hlsManifestUrl ?? httpVideoURL,
    [hlsManifestUrl, httpVideoURL],
  );

  const [fullscreen, setFullScreen] = useState(false);
  const [landscape, setLandscape] = useState(false);
  const focus = useIsFocused();

  useEffect(() => {
    Orientation.getOrientation(orientation => {
      setLandscape(
        orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT",
      );
    });
  }, []);

  useOrientationChange(orientation => {
    // Do not react if not focused
    if (!focus) {
      return;
    }
    if (!DeviceInfo.isTablet()) {
      setFullScreen(
        orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT",
      );
    }
    setLandscape(
      orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT",
    );
  });

  console.log("Landscape: ", landscape);

  const phoneLandscape = useMemo(
    () => !DeviceInfo.isTablet() && landscape,
    [landscape],
  );

  console.log("Phone Landscape: ", phoneLandscape);

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

  const listHeader = () => (
    <View style={styles.videoMetadataContainer}>
      <Text style={[styles.titleStyle, {color: style.textColor}]}>
        {YTVideoInfo.title}
      </Text>
      <View style={styles.subtitleContainer}>
        <Text style={[styles.subtitleStyle, {color: style.textColor}]}>
          {YTVideoInfo.short_views}
        </Text>
        <Text
          style={[
            styles.subtitleStyle,
            styles.subtitleDate,
            {color: style.textColor},
          ]}>
          {YTVideoInfo.publishDate}
        </Text>
      </View>
      <View style={styles.channelContainer}>
        <ChannelIcon
          channelId={YTVideoInfo.channel_id!}
          imageStyle={styles.channelStyle}
        />
        <Text style={[styles.channelTextStyle, {color: style.textColor}]}>
          {YTVideoInfo.channel?.name ?? YTVideoInfo.author?.name}
        </Text>
      </View>
      <View style={styles.likeContainer}>
        <Icon
          name={"like2"}
          type={"antdesign"}
          color={actionData?.liked ? "blue" : undefined}
          raised
          reverse
          size={15}
          onPress={() => (actionData?.liked ? removeRating() : like())}
        />
        <Icon
          name={"dislike2"}
          type={"antdesign"}
          color={actionData?.disliked ? "blue" : undefined}
          raised
          reverse
          size={15}
          onPress={() => (actionData?.disliked ? removeRating() : dislike())}
        />
      </View>
    </View>
  );

  const tabletLandscape = DeviceInfo.isTablet() && landscape;

  return (
    <View
      style={[
        styles.container,
        tabletLandscape ? styles.containerTabletLandscape : undefined,
      ]}>
      <OrientationLocker orientation={ALL_ORIENTATIONS_BUT_UPSIDE_DOWN} />
      <View
        style={
          tabletLandscape
            ? styles.tabletLandscapeLeftContainer
            : styles.nonTabletLeftContainer
        }>
        <View
          style={[
            phoneLandscape ? StyleSheet.absoluteFill : styles.videoContainer,
            tabletLandscape
              ? styles.videoContainerTabletLandscape
              : styles.videoContainerTablet,
          ]}>
          <VideoComponent
            url={videoUrl}
            style={[
              phoneLandscape
                ? styles.videoComponentFullscreen
                : [
                    styles.videoComponent,
                    !DeviceInfo.isTablet()
                      ? styles.videoComponentPhone
                      : undefined,
                  ],
            ]}
            videoInfo={YTVideoInfo}
            fullscreen={fullscreen}
          />
        </View>
        {tabletLandscape ? <ScrollView>{listHeader()}</ScrollView> : null}
      </View>
      <NextVideos
        YTVideoInfo={YTVideoInfo}
        phoneLandscape={phoneLandscape}
        listHeader={tabletLandscape ? undefined : listHeader()}
        tabletLandscape={tabletLandscape}
      />
    </View>
  );
}

interface ChildProps {
  YTVideoInfo: YTVideoInfoType;
  phoneLandscape?: boolean;
  tabletLandscape?: boolean;
  listHeader?: React.ReactElement;
}

function NextVideos({
  YTVideoInfo,
  phoneLandscape,
  listHeader,
  tabletLandscape,
}: ChildProps) {
  const columns = useGridColumnsPreferred();
  const sheetRef = useRef<BottomSheet>(null);
  const inserts = useSafeAreaInsets();

  return (
    <>
      {!phoneLandscape ? (
        <View
          style={[
            styles.nextVideosContainer,
            tabletLandscape
              ? styles.nextVideosContainerTabletLandscape
              : undefined,
          ]}>
          {YTVideoInfo.originalData.watch_next_feed ? (
            DeviceInfo.isTablet() && !tabletLandscape ? (
              <GridView
                shelfItem={YTVideoInfo.originalData.watch_next_feed}
                ListHeaderComponent={listHeader}
                // contentContainerStyle={{paddingBottom: inserts.bottom}}
                columns={columns}
              />
            ) : (
              <VerticalVideoList
                nodes={parseObservedArray(
                  YTVideoInfo.originalData.watch_next_feed,
                )}
                ListHeaderComponent={listHeader}
                contentContainerStyle={{paddingBottom: inserts.bottom}}
              />
            )
          ) : null}
          {YTVideoInfo.playlist ? (
            <PlaylistBottomSheetContainer
              ytInfoPlaylist={YTVideoInfo.playlist}
              onPress={() => sheetRef.current?.snapToIndex(0)}
            />
          ) : null}
          {YTVideoInfo.playlist ? (
            <PlaylistBottomSheet
              ytInfoPlaylist={YTVideoInfo?.playlist}
              ref={sheetRef}
            />
          ) : null}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTabletLandscape: {
    flexDirection: "row",
  },
  contentContainer: {
    height: "100%",
  },
  tabletLandscapeLeftContainer: {
    height: "100%",
    width: "68%",
  },
  nonTabletLeftContainer: {
    flex: 1,
  },
  videoContainer: {
    height: "35%",
  },
  videoContainerTabletLandscape: {
    height: "65%",
    width: "100%",
  },
  videoContainerTablet: {
    height: "100%",
  },
  videoComponent: {
    flex: 1,
    marginTop: 75, // TODO: Check for Android?
  },
  videoComponentPhone: {
    marginTop: 90, // TODO: Check for Android?
  },
  videoComponentFullscreen: {
    height: "100%",
    width: "100%",
    marginTop: 30, // TODO: Check for Android? MAYBE Fixable with Screenoptions in Navigator
  },
  videoMetadataScrollContainer: {
    backgroundColor: "#111111", // Must be the same as below
  },
  videoMetadataContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#111111",
  },
  titleStyle: {
    fontSize: 15,
  },
  subtitleContainer: {
    flexDirection: "row",
  },
  subtitleStyle: {
    fontSize: 13,
    marginTop: 5,
  },
  subtitleDate: {
    marginStart: 5,
  },
  channelContainer: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  channelStyle: {
    width: 40,
    height: 40,
  },
  channelTextStyle: {
    marginStart: 5,
  },
  likeContainer: {
    flexDirection: "row",
  },
  nextVideosContainer: {
    flex: 1,
  },
  nextVideosContainerTabletLandscape: {
    marginTop: 70, // TODO: Check for Android?
  },
});
