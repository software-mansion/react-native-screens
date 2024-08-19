import * as React from 'react';
import {
  Button,
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';

import { NavPropObj } from '../types';

export default function PushWithScrollView({ navigation }: NavPropObj): React.JSX.Element {
  const [additionalContentVisible, setAdditionalContentVisible] =
    React.useState(true);

  const svRef = React.useRef<ScrollView | null>(null);
  const contentRef = React.useRef<View | null>(null);

  const additionalContentRowCount = 150;

  return (
    <View style={{ flex: 1, backgroundColor: 'palevioletred' }}>
      <ScrollView ref={svRef} nestedScrollEnabled={true} scrollEnabled>
        <View ref={contentRef}>
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
            title="Open formSheet"
            onPress={() => navigation.navigate('SheetScreen')}
          />
          <Button
            title="Toggle content"
            onPress={() => setAdditionalContentVisible(old => !old)}
          />
          {additionalContentVisible &&
            [...Array(additionalContentRowCount).keys()].map(val => (
              <Text key={`${val}`}>Some component {val}</Text>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

