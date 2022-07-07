import React from 'react';
import { Button, Text, View } from 'react-native';

export default function ScreenA({navigation}) {
  return (
    <View style={{flex:1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}} >
      <Text style={{color: 'white'}}>ScreenA, with backgroundColor: 'blue'</Text>
      <Button title={"navigate to: Screen B"} onPress={() => navigation.navigate('screenB')} />
    </View>
  );
}
