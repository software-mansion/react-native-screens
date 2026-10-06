import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  Button,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4785
//
// A presented formSheet renders a ScrollView, then replaces it with plain content
// while it stays presented. A full-screen Modal opened from the sheet gets the
// recycled ScrollView instance as its horizontal pager. The sheet's bounds
// observer still points at that instance and forces it to the sheet's frame, so
// the pager's native viewport is shorter than its layout and it scrolls
// vertically. The overlay shows both heights.

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type StackNavigationProp = NativeStackNavigationProp<StackParamList>;

const SCROLL_ROW_COUNT = 30;
const PAGE_COLORS = [
  Colors.RedLight100,
  Colors.BlueLight100,
  Colors.GreenLight100,
];

type Size = { width: number; height: number };

function getVerdict(viewport: Size | undefined, isBroken: boolean) {
  if (!viewport) return 'Measuring…';
  return isBroken ? 'BROKEN: the pager scrolls vertically' : 'OK';
}

function Home({ navigation }: { navigation: StackNavigationProp }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
        testID="home-open-form-sheet"
      />
    </View>
  );
}

function Pager({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [layout, setLayout] = useState<Size>();
  const [viewport, setViewport] = useState<Size>();

  // A scroll event reports the UIScrollView's real bounds (layoutMeasurement),
  // so nudge it once instead of waiting for a drag.
  useEffect(() => {
    if (!layout) return;
    const timeout = setTimeout(
      () => scrollRef.current?.scrollTo({ x: 1, y: 0, animated: false }),
      500,
    );
    return () => clearTimeout(timeout);
  }, [layout]);

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) =>
    setViewport(nativeEvent.layoutMeasurement);

  const isBroken =
    !!layout &&
    !!viewport &&
    Math.round(viewport.height) !== Math.round(layout.height);

  return (
    <Modal animationType="slide" onRequestClose={onClose}>
      <View
        style={{ flex: 1 }}
        onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}>
        {layout && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={handleScroll}
            testID="pager">
            {PAGE_COLORS.map(color => (
              <View
                key={color}
                style={{
                  width: layout.width,
                  height: layout.height,
                  backgroundColor: color,
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 120,
          left: 16,
          right: 16,
          gap: 8,
          padding: 16,
          borderRadius: 12,
          backgroundColor: Colors.White,
        }}>
        <Text>Layout height: {layout?.height ?? '…'}</Text>
        <Text>Native viewport height: {viewport?.height ?? '…'}</Text>
        <Text style={{ fontWeight: '600' }} testID="pager-verdict">
          {getVerdict(viewport, isBroken)}
        </Text>
        <Button title="Close" onPress={onClose} testID="pager-close" />
      </View>
    </Modal>
  );
}

function FormSheetScreen() {
  const [isScrollViewMounted, setIsScrollViewMounted] = useState(true);
  const [isPagerOpen, setIsPagerOpen] = useState(false);

  // Stands in for a loading state that renders a ScrollView and is then
  // replaced by other content while the sheet stays presented.
  useEffect(() => {
    const timeout = setTimeout(() => setIsScrollViewMounted(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      {isScrollViewMounted ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {[...Array(SCROLL_ROW_COUNT).keys()].map(index => (
            <Text key={index}>Scroll row {index}</Text>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 16,
          }}>
          <Text>The ScrollView is gone; the sheet stays presented.</Text>
          <Button
            title="Open full-screen pager"
            onPress={() => setIsPagerOpen(true)}
            testID="form-sheet-open-pager"
          />
        </View>
      )}
      {isPagerOpen && <Pager onClose={() => setIsPagerOpen(false)} />}
    </View>
  );
}

export default function Test4785() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={{
            title: 'Sheet',
            presentation: 'formSheet',
            sheetGrabberVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
