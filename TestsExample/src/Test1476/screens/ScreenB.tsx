import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';


export default function ScreenB({navigation}) {
  return (
    <View style={{flex:1, backgroundColor: 'cyan', alignItems: 'center', justifyContent: 'center'}} >
      <Text>ScreenB, with backgroundColor: 'cyan'</Text>
      <Button title={"navigate to: Modal A"} onPress={() => navigation.navigate('modalA')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});