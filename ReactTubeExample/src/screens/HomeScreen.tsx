import React, {useEffect, useState} from "react";
import {Platform, TVEventControl} from "react-native";
import useHomeScreen from "../hooks/useHomeScreen";
import Logger from "../utils/Logger";
import LoadingComponent from "../components/general/LoadingComponent";
import {useDrawerContext} from "../navigation/DrawerContext";
import GridView from "../components/GridView";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {OrientationLocker} from "react-native-orientation-locker";
import {Icon} from "@rneui/base";
import DeviceInfo from "react-native-device-info";
import useGridColumnsPreferred from "../hooks/home/useGridColumnsPreferred";

const LOGGER = Logger.extend("HOME");

export default function HomeScreen() {
  const [fetchDate, setFetchDate] = useState(Date.now());
  const {content, fetchMore, refresh} = useHomeScreen();

  const {onScreenFocused} = useDrawerContext();

  const navigation = useNavigation();

  useFocusEffect(() => {
    if (Math.abs(Date.now() - fetchDate) > 43200000) {
      LOGGER.debug("Triggering refresh home content");
      refresh();
      setFetchDate(Date.now());
    } else {
      LOGGER.debug("Last fetch has been recently. Skipping refresh");
    }
  });

  useEffect(() => {
    if (!Platform.isTV) {
      navigation.setOptions({
        headerRight: () => (
          <Icon
            name={"search"}
            onPress={() => navigation.navigate("Search")}
            color={"white"}
            style={{marginEnd: 10}}
          />
        ),
      });
    }
  }, [navigation]);

  useFocusEffect(() => {
    TVEventControl.disableTVMenuKey();
  });

  const columns = useGridColumnsPreferred();

  if (!content) {
    return <LoadingComponent />;
  }

  return (
    <>
      {!Platform.isTV && !DeviceInfo.isTablet() ? (
        <OrientationLocker orientation={"PORTRAIT"} />
      ) : null}
      <GridView
        columns={columns}
        shelfItem={content}
        onEndReached={() => {
          console.log("End reached");
          fetchMore().catch(console.warn);
        }}
        onElementFocused={onScreenFocused}
      />
    </>
  );
}
