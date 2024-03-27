import React, {forwardRef} from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from "react-native";

// TODO: Create component with large invisible touch field where element is still small compared to that ?!

interface Props<K extends TouchableWithoutFeedbackProps>
  extends TouchableWithoutFeedbackProps {
  touchableComponent?: K;
  containerStyle: StyleProp<ViewStyle>;
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const TouchableField = forwardRef<
  TouchableOpacity,
  Props<TouchableOpacityProps>
>(({style, containerStyle, children, ...props}, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      style={[{alignItems: "center", justifyContent: "center"}, containerStyle]}
      {...props}>
      <View style={style}>{children}</View>
    </TouchableOpacity>
  );
});

export default TouchableField;
