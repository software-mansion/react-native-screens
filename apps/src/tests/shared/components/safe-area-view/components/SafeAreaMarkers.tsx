import { Colors } from "@apps/shared/styling";
import React from "react"
import { StyleSheet, Text, View } from "react-native"

export function SafeAreaMarkers() {
  return (
    <>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { left: 0 }]}>
        <SafeAreaMarkerText text="LEFT" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { top: 0 }]}>
        <SafeAreaMarkerText text="TOP" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { right: 0 }]}>
        <SafeAreaMarkerText text="RIGHT" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { bottom: 0 }]}>
        <SafeAreaMarkerText text="BOTTOM" />
      </View>
    </>
  )
}

export function SafeAreaMarkerText(props: { text: string }) {
  return (
    <View style={{ display: 'contents' }}>
      <Text style={{ color: Colors.GreenLight20, fontSize: 32, fontWeight: 'bold' }}>{props.text}</Text>
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

