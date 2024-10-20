import React from "react";
import { View, Modal, Text } from "react-native";
import { FullWindowOverlay } from "react-native-screens";

export default function TestFullScreenOverlay() {
  return (
    <View style={{flex:1}}>
      <View style={{position:'absolute', top:0,left:0,right:0,bottom:0}}>
        <View style={{ flex: 1, borderColor: 'black', borderWidth: 1, borderRadius: 20, backgroundColor: 'lightcyan', position: 'absolute', top: 200, padding: 40, marginHorizontal: 20 }}>
          <Text>RNView</Text>
        </View>
      </View>
      <Modal visible={true} transparent>
        <View style={{ flex: 1, borderColor: 'black', borderWidth: 1, borderRadius: 20, backgroundColor: 'gainsboro', position: 'absolute', top: 200, left: 100, padding: 40, marginHorizontal: 20 }}>
          <Text>Modal</Text>
        </View>
      </Modal>
      <FullWindowOverlay>
        <View style={{ position: 'absolute', top: 160, padding: 20, marginHorizontal: 50, backgroundColor: 'wheat', borderRadius: 10, shadowOffset: { width: 4, height: 4}, shadowOpacity: 0.2, shadowRadius: 10}}>
          <Text>FullWindowOverlay #1</Text>
        </View>
      </FullWindowOverlay>
      <FullWindowOverlay>
        <View style={{ position: 'absolute', top: 280, padding: 20, marginHorizontal: 50, backgroundColor: 'wheat', borderRadius: 10, shadowOffset: { width: 4, height: 4}, shadowOpacity: 0.2, shadowRadius: 10}}>
          <Text>FullWindowOverlay #2</Text>
        </View>
      </FullWindowOverlay>
    </View>
  )
}
