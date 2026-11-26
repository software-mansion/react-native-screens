import React, { useRef, useState } from 'react';
import {
  Animated,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const ANIMATED_BOX_HEIGHT = 160;
const ANIMATED_BOX_DURATION = 1000;
// Shorter than the presentation, resize and keyboard animations, so the next change lands while one of them is running.
const MID_ANIMATION_DELAY = 100;

function ExtraContentBox() {
  return (
    <View style={styles.extraContentBox}>
      <Text style={styles.extraText}>
        This box is mounted and unmounted at once.
      </Text>
    </View>
  );
}

function TextInputSheetContent({ onDismiss }: { onDismiss: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => setIsExpanded(expanded => !expanded);

  const toggleContentThenHideKeyboard = () => {
    toggleContent();
    setTimeout(Keyboard.dismiss, MID_ANIMATION_DELAY);
  };

  return (
    <View style={styles.sheetContent}>
      <Text style={styles.description}>
        Focus the input to show the keyboard, then change the content height
        with the buttons below.
      </Text>

      <View style={styles.spacing} />

      <TextInput
        style={styles.input}
        placeholder="Text input"
        placeholderTextColor={Colors.cardBorder}
      />

      <Button
        title={isExpanded ? 'Collapse Content' : 'Expand Content'}
        color={Colors.primary}
        onPress={toggleContent}
      />

      {isExpanded && <ExtraContentBox />}

      <View style={styles.spacing} />

      <Button
        title={
          isExpanded
            ? 'Collapse Content And Hide Keyboard'
            : 'Expand Content And Hide Keyboard'
        }
        color={Colors.primary}
        onPress={toggleContentThenHideKeyboard}
      />

      <View style={styles.spacing} />

      <Button
        title="Dismiss from JS"
        color={Colors.primary}
        onPress={onDismiss}
      />
    </View>
  );
}

function TestFormSheetDefaultResizeAnimation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTextInputSheetOpen, setIsTextInputSheetOpen] = useState(false);
  const [isDefaultAnimationEnabled, setIsDefaultAnimationEnabled] =
    useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimatedBoxExpanded, setIsAnimatedBoxExpanded] = useState(false);

  const animatedBoxHeight = useRef(new Animated.Value(0)).current;

  const toggleContent = () => setIsExpanded(expanded => !expanded);

  const toggleContentTwice = () => {
    toggleContent();
    setTimeout(toggleContent, MID_ANIMATION_DELAY);
  };

  const openThenExpandContent = () => {
    setIsExpanded(false);
    setIsOpen(true);
    setTimeout(() => setIsExpanded(true), MID_ANIMATION_DELAY);
  };

  const toggleAnimatedBox = () => {
    Animated.timing(animatedBoxHeight, {
      toValue: isAnimatedBoxExpanded ? 0 : ANIMATED_BOX_HEIGHT,
      duration: ANIMATED_BOX_DURATION,
      // `height` is a layout prop, which the native driver does not animate.
      useNativeDriver: false,
    }).start();
    setIsAnimatedBoxExpanded(!isAnimatedBoxExpanded);
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Test</Text>
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet And Expand Content"
        color={Colors.primary}
        onPress={openThenExpandContent}
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet With Text Input"
        color={Colors.primary}
        onPress={() => setIsTextInputSheetOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleDismiss}
        detents="fitToContents"
        defaultResizeAnimationEnabled={isDefaultAnimationEnabled}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>

          <Text style={styles.description}>
            This sheet animates a change of its content height by default. Use
            the buttons below to change the height.
          </Text>

          <Text style={styles.propValue}>
            {`defaultResizeAnimationEnabled: ${isDefaultAnimationEnabled}`}
          </Text>

          <View style={styles.spacing} />

          <Button
            title={
              isDefaultAnimationEnabled
                ? 'Disable Default Animation'
                : 'Enable Default Animation'
            }
            color={Colors.primary}
            onPress={() =>
              setIsDefaultAnimationEnabled(!isDefaultAnimationEnabled)
            }
          />

          <View style={styles.spacing} />

          <Button
            title={isExpanded ? 'Collapse Content' : 'Expand Content'}
            color={Colors.primary}
            onPress={toggleContent}
          />

          {isExpanded && <ExtraContentBox />}

          <View style={styles.spacing} />

          <Button
            title={
              isExpanded
                ? 'Collapse And Expand Content'
                : 'Expand And Collapse Content'
            }
            color={Colors.primary}
            onPress={toggleContentTwice}
          />

          <View style={styles.spacing} />

          <Button
            title={
              isAnimatedBoxExpanded
                ? 'Collapse Animated Box'
                : 'Expand Animated Box'
            }
            color={Colors.primary}
            onPress={toggleAnimatedBox}
          />

          <Animated.View
            style={[styles.animatedBox, { height: animatedBoxHeight }]}
          />

          <View style={styles.spacing} />

          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={handleDismiss}
          />
        </View>
      </FormSheet>
      <FormSheet
        isOpen={isTextInputSheetOpen}
        onNativeDismiss={() => setIsTextInputSheetOpen(false)}
        detents="fitToContents">
        <TextInputSheetContent
          onDismiss={() => setIsTextInputSheetOpen(false)}
        />
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  sheetContent: {
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    paddingHorizontal: 16,
  },
  propValue: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text,
  },
  extraContentBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.offBackground,
    borderRadius: 8,
    width: '100%',
  },
  extraText: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
  },
  animatedBox: {
    marginTop: 20,
    backgroundColor: Colors.cardBorder,
    borderRadius: 8,
    width: '100%',
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(
  TestFormSheetDefaultResizeAnimation,
  scenarioDescription,
);
