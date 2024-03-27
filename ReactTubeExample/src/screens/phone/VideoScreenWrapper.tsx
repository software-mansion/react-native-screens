import React from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/RootStackNavigator";
import ReelVideoScreen from "./ReelVideoScreen";
import VideoScreen from "./VideoScreen";

type Props = NativeStackScreenProps<RootStackParamList, "VideoScreen">;

export default function VideoScreenWrapper(props: Props) {
  // TODO:  Not ready yet
  if (props.route.params.reel) {
    return <ReelVideoScreen {...props} />;
  }

  return <VideoScreen {...props} />;
}
