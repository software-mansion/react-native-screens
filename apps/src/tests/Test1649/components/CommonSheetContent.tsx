import * as React from 'react';
import {
  Button,
  View,
  TextInput,
  Text,
} from 'react-native';

import * as jotai from 'jotai';

import {
  allowedDetentsAtom,
  cornerRadiusAtom,
  expandsWhenScrolledToEdgeAtom,
  grabberVisibleAtom,
  isAdditionalContentVisibleAtom,
  largestUndimmedDetentAtom,
  selectedDetentIndexAtom
} from '../state';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import GestureHandlerButton from './GestureHandlerButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function CommonSheetContent(): React.JSX.Element {
  const navigation: NativeStackNavigationProp<ParamListBase> = useNavigation();

  const [radius, setRadius] = jotai.useAtom(cornerRadiusAtom);
  const [detents, _] = jotai.useAtom(allowedDetentsAtom);
  const [largestUndimmedDetent, setLargestUndimmedDetent] = jotai.useAtom(
    largestUndimmedDetentAtom,
  );
  const [isGrabberVisible, setIsGrabberVisible] =
    jotai.useAtom(grabberVisibleAtom);
  const [shouldExpand, setShouldExpand] = jotai.useAtom(
    expandsWhenScrolledToEdgeAtom,
  );
  const [selectedDetentIndex, setSelectedDetentIndex] = jotai.useAtom(
    selectedDetentIndexAtom,
  );
  const isAdditionalContentVisible = jotai.useAtomValue(
    isAdditionalContentVisibleAtom,
  );

  const ref = React.useRef<TextInput>(null);

  function nextDetentLevel(_: number): number {
    return 0;
  }

  return (
    <View style={[{ backgroundColor: 'lightgreen' }]}>
      <View style={{ paddingTop: 10 }}>
        <TextInput
          style={{
            backgroundColor: 'lightblue',
            paddingHorizontal: 5,
            margin: 5,
            borderRadius: 5,
          }}
          placeholder="123"
          inputMode="numeric"
          ref={ref}
        />
        <Button
          title="PopTo First"
          onPress={() => navigation.popTo('First')}
        />
        <Button
          title="PopTo Second"
          onPress={() => navigation.popTo('Second')}
        />
        <Button
          title='Navigate Third'
          onPress={() => navigation.navigate('Third')}
        />
        <Button
          title="Navigate NestedStack"
          onPress={() => {
            navigation.navigate('NestedStack');
          }}
        />
        <Button
          title="GoBack"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title="Tap me to open another sheet"
          onPress={() => {
            if (ref.current) {
              // ref.current.blur();
              navigation.navigate('AnotherSheetScreen');
            }
          }}
        />
        <Button
          title="Change the corner radius"
          onPress={() => {
            const newRadius = radius >= 150 ? -1.0 : radius + 50;
            setRadius(newRadius);
            navigation.setOptions({
              sheetCornerRadius: newRadius,
            });
          }}
        />
        <Text>radius: {radius}</Text>
        <Button
          title="Change detent level"
          onPress={() => {
            const newDetentLevel = nextDetentLevel(
              detents[selectedDetentIndex],
            );
            setSelectedDetentIndex(newDetentLevel);
            // navigation.setOptions({
            //   sheetAllowedDetents: newDetentLevel,
            // });
          }}
        />
        <Text>Allowed detents: {detents}</Text>
        <Button
          title="Change largest undimmed detent"
          onPress={() => {
            const newDetentLevel = nextDetentLevel(largestUndimmedDetent);
            setLargestUndimmedDetent(newDetentLevel);
            navigation.setOptions({
              sheetLargestUndimmedDetent: newDetentLevel,
            });
          }}
        />
        <Text>largestUndimmedDetent: {largestUndimmedDetent}</Text>
        <Button
          title="Toggle sheetExpandsWhenScrolledToEdge"
          onPress={() => {
            setShouldExpand(!shouldExpand);
            navigation.setOptions({
              sheetExpandsWhenScrolledToEdge: !shouldExpand,
            });
          }}
        />
        <Text>
          sheetExpandsWhenScrolledToEdge: {shouldExpand ? 'true' : 'false'}
        </Text>
        <Button
          title="Toggle grabber visibility"
          onPress={() => {
            setIsGrabberVisible(!isGrabberVisible);
            navigation.setOptions({
              sheetGrabberVisible: !isGrabberVisible,
            });
          }}
        />
      </View>
      <GestureHandlerButton />
      {isAdditionalContentVisible && (
        <View style={{ backgroundColor: 'pink' }}>
          <Text>Additional content</Text>
        </View>
      )}
    </View>
  );
}

