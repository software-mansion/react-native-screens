import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const SCREEN_WIDTH = Dimensions.get('window').width;

type BackgroundType = 'none' | 'solid' | 'composed' | 'image';

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [bgType, setBgType] = useState<BackgroundType>('image');

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const SolidBackground = (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors.PurpleLight100 },
      ]}
    />
  );

  const ComposedBackground = (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors.NavyLight80 },
      ]}>
      <View style={styles.composedTopBar} />
      <View style={styles.composedBottomBar} />
    </View>
  );

  const ImageBackground = (
    <Image
      source={{
        uri: 'https://fastly.picsum.photos/id/541/900/600.jpg?hmac=W6n9QTOEWat4-wHywp8az4ZqvcDzUMWWR1XDq3kS9sI',
        height: 600,
        width: SCREEN_WIDTH,
      }}
      style={StyleSheet.absoluteFill}
    />
  );

  const renderBackground = () => {
    switch (bgType) {
      case 'solid':
        return SolidBackground;
      case 'composed':
        return ComposedBackground;
      case 'image':
        return ImageBackground;
      case 'none':
      default:
        return undefined;
    }
  };

  const isDarkBg = bgType !== 'none';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Background</Text>

      <View style={styles.controlsContainer}>
        <Text style={styles.controlsLabel}>Select Background Type:</Text>
        <View style={styles.buttonRow}>
          {(['none', 'solid', 'composed', 'image'] as BackgroundType[]).map(
            type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  bgType === type && styles.optionButtonActive,
                ]}
                onPress={() => setBgType(type)}>
                <Text
                  style={[
                    styles.optionText,
                    bgType === type && styles.optionTextActive,
                  ]}>
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      <View style={styles.spacing} />

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleDismiss}
        detents='fitToContents'
        backgroundComponent={renderBackground()}>
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, isDarkBg && styles.textWhite]}>
            Custom Background
          </Text>

          <Text style={[styles.description, isDarkBg && styles.textWhite]}>
            Currently displaying: {bgType.toUpperCase()}. The background should
            stretch to fill the entire native sheet, including the bottom safe
            area.
          </Text>

          <View style={styles.spacing} />

          <Button
            title="Dismiss from JS"
            color={isDarkBg ? Colors.White : Colors.primary}
            onPress={handleDismiss}
          />
        </View>
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
  controlsContainer: {
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  controlsLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: Colors.White,
  },
  sheetContent: {
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
  textWhite: {
    color: Colors.White,
    textShadowColor: Colors.NavyLightTransparent,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  spacing: {
    height: 24,
  },
  composedTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: Colors.GreenLight100,
  },
  composedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: Colors.RedLight100,
  },
});

export default createScenario(App, scenarioDescription);
