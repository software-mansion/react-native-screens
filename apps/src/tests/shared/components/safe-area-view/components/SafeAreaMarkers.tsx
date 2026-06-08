import { Colors } from "@apps/shared/styling";
import React from "react"
import { ColorValue, StyleSheet, Text, View } from "react-native"

export interface SafeAreaMarkerProps {
  isLeftEnabled?: boolean;
  isTopEnabled?: boolean;
  isRightEnabled?: boolean;
  isBottomEnabled?: boolean;
  markerTextProps?: Omit<SafeAreaMarkerTextProps, 'text'>;
}

export interface SafeAreaMarkerTextProps {
  text: string;
  textColor?: ColorValue;
  fontSize?: number;
}

export function SafeAreaMarkers(props: SafeAreaMarkerProps) {
  const {
    isLeftEnabled = true,
    isTopEnabled = true,
    isRightEnabled = true,
    isBottomEnabled = true,
  } = props;

  const leftDisplay = isLeftEnabled ? 'flex' : 'none';
  const topDisplay = isTopEnabled ? 'flex' : 'none';
  const rightDisplay = isRightEnabled ? 'flex' : 'none';
  const bottomDisplay = isBottomEnabled ? 'flex' : 'none';

  return (
    <>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { left: 0 }, { display: leftDisplay }]}>
        <SafeAreaMarkerText text="LEFT" {...props.markerTextProps} />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { top: 0 }, { display: topDisplay }]}>
        <SafeAreaMarkerText text="TOP" {...props.markerTextProps} />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { right: 0 }, { display: rightDisplay }]}>
        <SafeAreaMarkerText text="RIGHT" {...props.markerTextProps} />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { bottom: 0 }, { display: bottomDisplay }]}>
        <SafeAreaMarkerText text="BOTTOM" {...props.markerTextProps} />
      </View>
    </>
  )
}

export function SafeAreaMarkerText(props: SafeAreaMarkerTextProps) {
  return (
    <View style={{ display: 'contents' }}>
      <Text style={{ color: props.textColor ?? Colors.GreenLight20, fontSize: props.fontSize ?? 32, fontWeight: 'bold' }}>{props.text}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  safeAreaBar: {
    position: 'absolute',
    // backgroundColor: Colors.GreenLight100,
    justifyContent: 'center',
  },
  safeAreaBarHorizontal: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
  },
  safeAreaBarVertical: {
    height: '100%',
    paddingHorizontal: 8,
  },
})

