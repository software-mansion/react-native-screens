import React, {useEffect} from "react";
import {RootStackParamList} from "../navigation/RootStackNavigator";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {Button, CheckBox, Icon} from "@rneui/base";
import {useAppData} from "../context/AppDataContext";
import useAccountData from "../hooks/account/useAccountData";
import {useNavigation} from "@react-navigation/native";

type Props = DrawerScreenProps<RootStackParamList, "SettingsScreen">;

export default function SettingsScreen({}: Props) {
  const {appSettings, updateSettings} = useAppData();
  const {logout, clearAllData} = useAccountData();

  const navigation = useNavigation();

  useEffect(() => {
    if (!Platform.isTV) {
      navigation.setOptions({
        headerRight: () => (
          <Icon
            name={"login"}
            // @ts-ignore
            onPress={() => navigation.navigate("LoginScreen")}
            color={"white"}
            style={{marginEnd: 10}}
          />
        ),
      });
    }
  }, [navigation]);

  return (
    <View style={styles.containerStyle}>
      <Text>Settings</Text>
      <CheckBox
        style={styles.checkBoxStyle}
        center
        title="VLC"
        checked={appSettings.vlcEnabled ?? false}
        onPress={() => {
          console.log("Press");
          updateSettings({vlcEnabled: !(appSettings.vlcEnabled ?? false)});
        }}
        Component={TouchableOpacity}
      />
      <CheckBox
        style={styles.checkBoxStyle}
        center
        title="HLS Enabled (if available)"
        checked={appSettings.hlsEnabled ?? true}
        onPress={() => {
          updateSettings({hlsEnabled: !(appSettings.hlsEnabled ?? true)});
        }}
        Component={TouchableOpacity}
      />
      <CheckBox
        style={styles.checkBoxStyle}
        center
        title="Local HLS Enabled"
        checked={appSettings.localHlsEnabled ?? false}
        onPress={() => {
          updateSettings({
            localHlsEnabled: !(appSettings.localHlsEnabled ?? false),
          });
        }}
        Component={TouchableOpacity}
      />
      <Button title={"Logout"} onPress={() => logout()} />
      <Button title={"Clear all"} onPress={() => clearAllData()} />
      <Button
        title={"Refresh Home Screen"}
        onPress={() => DeviceEventEmitter.emit("HomeScreenRefresh")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  checkBoxStyle: {
    flex: 1,
  },
});
