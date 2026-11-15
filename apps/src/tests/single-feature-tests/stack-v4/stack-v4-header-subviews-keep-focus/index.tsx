import React, { useRef, useState } from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  type HeaderBarButtonItem,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

type InputPlacement = 'title' | 'left' | 'right';

const PLACEMENTS: InputPlacement[] = ['title', 'left', 'right'];
const TITLES = ['Focus', 'Focus updated'];
const TINT_COLORS = [Colors.BlueLight100, Colors.RedLight100];

type TextInputRef = React.ComponentRef<typeof TextInput>;

function HeaderInput({
  onFocus,
  onBlur,
  inputRef,
}: {
  onFocus: () => void;
  onBlur: () => void;
  inputRef: React.RefObject<TextInputRef | null>;
}) {
  return (
    <TextInput
      ref={inputRef}
      testID="header-input"
      placeholder="Type here"
      onFocus={onFocus}
      onBlur={onBlur}
      style={styles.input}
    />
  );
}

function HeaderLabel({ testID, label }: { testID: string; label: string }) {
  return (
    <View style={styles.label}>
      <Text testID={testID}>{label}</Text>
    </View>
  );
}

function TestStackV4HeaderSubviewsKeepFocus() {
  const inputRef = useRef<TextInputRef>(null);
  const [placement, setPlacement] = useState<InputPlacement>('title');
  const [focused, setFocused] = useState(false);
  const [blurCount, setBlurCount] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [tintIndex, setTintIndex] = useState(0);
  const [barButtonVersion, setBarButtonVersion] = useState(1);
  const [extraViewVersion, setExtraViewVersion] = useState(1);
  const [showExtraView, setShowExtraView] = useState(false);
  const [itemsOnInputSide, setItemsOnInputSide] = useState(false);

  // The extra view is always mounted on a side that doesn't hold the input,
  // so mounting it only adds a subview next to the focused one.
  const extraViewSide: 'left' | 'right' =
    placement === 'left' ? 'right' : 'left';

  // Native bar button items go to the side opposite to the input by default.
  // On the input's side, changing them hands UIKit a new array that still
  // holds the input's bar button item.
  const barButtonItemsSide: 'left' | 'right' =
    placement === 'title'
      ? 'right'
      : itemsOnInputSide
      ? placement
      : placement === 'left'
      ? 'right'
      : 'left';

  const barButtonItems: HeaderBarButtonItem[] = [
    {
      type: 'button',
      title: `Item ${barButtonVersion}`,
      onPress: () => {},
    },
  ];

  const header = (
    <HeaderInput
      inputRef={inputRef}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setBlurCount(count => count + 1);
      }}
    />
  );

  const extraView = showExtraView ? (
    <HeaderLabel
      testID="header-extra-view"
      label={`Extra ${extraViewVersion}`}
    />
  ) : null;

  return (
    <ScreenStack style={styles.container}>
      <Screen key="focus" activityState={2} isNativeStack>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          contentInsetAdjustmentBehavior="automatic"
          testID="header-focus-scrollview">
          <Text testID="input-placement">Input in: {placement}</Text>
          <Text testID="input-focused">Input focused: {String(focused)}</Text>
          <Text testID="input-blur-count">Blur count: {blurCount}</Text>
          <Text testID="header-title-text">Title: {TITLES[titleIndex]}</Text>
          <Text testID="bar-button-items-side">
            Bar button items on: {barButtonItemsSide}
          </Text>
          {/* Compact rows, so every button stays above the keyboard. */}
          <View style={styles.row}>
            {PLACEMENTS.map(item => (
              <Button
                key={item}
                testID={`placement-${item}`}
                title={item}
                onPress={() => {
                  setShowExtraView(false);
                  setPlacement(item);
                }}
              />
            ))}
            <Button
              testID="blur-input"
              title="Blur"
              onPress={() => inputRef.current?.blur()}
            />
          </View>
          <View style={styles.row}>
            <Button
              testID="change-title"
              title="Title"
              onPress={() =>
                setTitleIndex(index => (index + 1) % TITLES.length)
              }
            />
            <Button
              testID="change-tint"
              title="Tint"
              onPress={() =>
                setTintIndex(index => (index + 1) % TINT_COLORS.length)
              }
            />
            <Button
              testID="change-bar-button-item"
              title="Item (iOS)"
              onPress={() => setBarButtonVersion(version => version + 1)}
            />
            <Button
              testID="toggle-bar-button-items-side"
              title="Items side (iOS)"
              onPress={() => setItemsOnInputSide(value => !value)}
            />
          </View>
          <View style={styles.row}>
            <Button
              testID="toggle-extra-view"
              title="Toggle extra view"
              onPress={() => setShowExtraView(value => !value)}
            />
            <Button
              testID="change-extra-view"
              title="Change extra view"
              onPress={() => setExtraViewVersion(version => version + 1)}
            />
          </View>
        </ScrollView>
        <ScreenStackHeaderConfig
          title={TITLES[titleIndex]}
          color={TINT_COLORS[tintIndex]}
          headerLeftBarButtonItems={
            Platform.OS === 'ios' && barButtonItemsSide === 'left'
              ? barButtonItems
              : undefined
          }
          headerRightBarButtonItems={
            Platform.OS === 'ios' && barButtonItemsSide === 'right'
              ? barButtonItems
              : undefined
          }>
          {placement === 'left' ? (
            <ScreenStackHeaderLeftView>{header}</ScreenStackHeaderLeftView>
          ) : null}
          {extraViewSide === 'left' && extraView ? (
            <ScreenStackHeaderLeftView>{extraView}</ScreenStackHeaderLeftView>
          ) : null}
          {placement === 'title' ? (
            <ScreenStackHeaderCenterView>{header}</ScreenStackHeaderCenterView>
          ) : null}
          {extraViewSide === 'right' && extraView ? (
            <ScreenStackHeaderRightView>{extraView}</ScreenStackHeaderRightView>
          ) : null}
          {placement === 'right' ? (
            <ScreenStackHeaderRightView>{header}</ScreenStackHeaderRightView>
          ) : null}
        </ScreenStackHeaderConfig>
      </Screen>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    width: 140,
    height: 32,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
  },
  label: {
    height: 32,
    justifyContent: 'center',
  },
});

export default createScenario(
  TestStackV4HeaderSubviewsKeepFocus,
  scenarioDescription,
);
