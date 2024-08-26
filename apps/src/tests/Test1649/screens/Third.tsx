import * as React from 'react';

import { NavPropObj } from "../types";
import { Button, TextInput, View } from 'react-native';

export default function Third({
  navigation,
}: NavPropObj) {
  const [color, _] = React.useState('firebrick');

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <TextInput
        style={{
          backgroundColor: 'lemonchiffon',
          borderRadius: 10,
          paddingHorizontal: 10,
          margin: 10,
        }}
        placeholder="Hello there General Kenobi"
      />
      <Button
        title="PopTo SheetScreen"
        onPress={() => navigation.popTo('SheetScreen')}
      />
      <Button
        title="Navigate SheetScreen"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Navigate SheetWithScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <Button
        title="Go back to second screen"
        onPress={() => navigation.popTo("Second")}
      />
    </View>
  );
}

