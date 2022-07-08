import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

type Props = {};

export default function ModalA(props: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.6)',alignItems: 'center', justifyContent: 'center'}}>
      <View style={{backgroundColor: 'white'}}>

      <Text>ModalA, with opacity and backgroundColor</Text>
      <Text>At ModalA, we still can gesture swipe the screenB back to screenA, </Text>
      <Button title={"pop modal"} onPress={() => props.navigation.pop()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});