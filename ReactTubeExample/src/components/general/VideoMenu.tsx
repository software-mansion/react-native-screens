import React, {useState} from "react";
import {Modal, StyleSheet, View} from "react-native";
import {ListItem} from "@rneui/base";
import {useNavigation} from "@react-navigation/native";
import {NativeStackProp} from "../../navigation/types";
import {useShelfVideoSelector} from "../../context/ShelfVideoSelector";
import LOGGER from "../../utils/Logger";
import useVideoElementData from "../../hooks/video/useVideoElementData";

const Logger = LOGGER.extend("VIDEOMENU");

// TODO: Add focus feedback

export default function VideoMenu() {
  const {selectedVideo, setSelectedVideo} = useShelfVideoSelector();

  return (
    <Modal
      visible={selectedVideo !== undefined}
      transparent
      onRequestClose={() => setSelectedVideo()}>
      <View style={styles.touchContainer}>
        {selectedVideo ? (
          <VideoMenuContent
            videoId={selectedVideo}
            onCloseModal={() => setSelectedVideo(undefined)}
          />
        ) : null}
      </View>
    </Modal>
  );
}

function VideoMenuContent({
  videoId,
  onCloseModal,
}: {
  videoId: string;
  onCloseModal: () => void;
}) {
  const navigation = useNavigation<NativeStackProp>();
  const {Video} = useVideoElementData(videoId);
  // console.log("VideoInfo: ", JSON.stringify(Video?.basic_info, null, 4));
  return (
    <VideoMenuItem
      title={"To Channel"}
      onPress={() => {
        // Sometimes the information is propagated in a different location
        const channelID =
          Video?.basic_info.channel_id ?? Video?.basic_info.channel?.id;
        if (channelID) {
          navigation.navigate("ChannelScreen", {
            channelId: channelID,
          });
          onCloseModal();
        } else {
          Logger.warn("No channel data available!");
        }
      }}
    />
  );
}

interface ItemProps {
  title: string;
  onPress: () => void;
}

function VideoMenuItem({title, onPress}: ItemProps) {
  const [focus, setFocus] = useState(false);
  return (
    <ListItem
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      containerStyle={styles.listItemContainer}
      onPress={onPress}>
      <ListItem.Title
        style={[styles.listItemTitle, {color: focus ? "white" : "black"}]}>
        {title}
      </ListItem.Title>
      <ListItem.Chevron />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  touchContainer: {
    backgroundColor: "#222222",
    width: "20%",
    height: "100%",
    alignSelf: "flex-end",
  },
  listItemContainer: {
    backgroundColor: "transparent",
  },
  listItemTitle: {
    flex: 1,
  },
});
