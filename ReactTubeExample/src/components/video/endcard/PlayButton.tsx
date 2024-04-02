import React, {forwardRef} from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {Icon} from "@rneui/base";
import TouchableField from "../../general/TouchableField";

interface Props {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const PlayButton = forwardRef<TouchableOpacity, Props>(
  ({onPress, style}, ref) => {
    return (
      <TouchableField
        ref={ref}
        style={style}
        containerStyle={{width: "100%"}}
        onPress={onPress}
        hasTVPreferredFocus>
        <View style={styles.container}>
          <Icon name={"play"} type={"font-awesome-5"} size={20} />
        </View>
      </TouchableField>
    );
  },
);

export default PlayButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderColor: "grey",
    borderRadius: 30,
    padding: 15,
    backgroundColor: "#cccccc",
  },
});
