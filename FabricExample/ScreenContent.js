/*
 * @format
 * @flow
 */
import {View, Text, StyleSheet, Button} from 'react-native';
import React, {useState} from 'react';
import {
  Screen,
  ScreenStackHeaderConfig,
  ScreenStackHeaderSubview,
} from './fabric';

function ScreenContent({pushScreen, popScreen, index}: any) {
  const [translucent, setTranslucent] = useState(false);
  const [show, setShow] = useState(true);
  return (
    <Screen
      style={StyleSheet.absoluteFill}
      onWillAppear={() => {
        console.log('Appear');
      }}>
      <ScreenStackHeaderConfig hidden={!show} translucent={translucent}>
        <ScreenStackHeaderSubview type="left">
          <Button
            title="Left"
            onPress={() => console.log('Left clicked')}
            style={{width: 50}}
          />
        </ScreenStackHeaderSubview>
        <ScreenStackHeaderSubview type="right">
          <Button
            title="Right"
            onPress={() => console.log('Right clicked')}
            style={{width: 50}}
          />
        </ScreenStackHeaderSubview>
        <ScreenStackHeaderSubview type="center">
          <Text>Teeeessst1</Text>
        </ScreenStackHeaderSubview>
      </ScreenStackHeaderConfig>
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: '#F00'}}>
          <Text style={{color: '#FFF', fontSize: 30}}>{index}</Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#0F0'}}>
          <Button
            title={`Turn translucent ${translucent ? 'off' : 'on'}`}
            onPress={() => setTranslucent(prev => !prev)}
          />
          <Button
            title={`${show ? 'Hide' : 'Show'} header`}
            onPress={() => setShow(prev => !prev)}
          />
        </View>
        <View style={{flex: 1, backgroundColor: '#00F'}}>
          <Button title="Push" onPress={pushScreen} />
          <Button title="Pop" onPress={popScreen} />
        </View>
      </View>
    </Screen>
  );
}

module.exports = ScreenContent;
