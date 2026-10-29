import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FormSheet,
  type FormSheetBackgroundEffect,
  type FormSheetBackgroundEffectBlurStyle,
} from 'react-native-screens';
import { SettingsPicker } from '@apps/shared';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type EffectKind = 'automatic' | 'none' | 'color' | 'blur';
type FillColor = 'white' | 'navy' | 'translucent';
type ContainerColor = 'none' | 'white' | 'navy' | 'translucent';

const DETENTS = [0.35, 0.7, 1.0];

const EFFECT_KINDS: EffectKind[] = ['automatic', 'none', 'color', 'blur'];
const FILL_COLORS: FillColor[] = ['white', 'navy', 'translucent'];
const CONTAINER_COLORS: ContainerColor[] = [
  'none',
  'white',
  'navy',
  'translucent',
];
const BLUR_STYLES: FormSheetBackgroundEffectBlurStyle[] = [
  'extraLight',
  'light',
  'dark',
  'regular',
  'prominent',
  'systemUltraThinMaterial',
  'systemThinMaterial',
  'systemMaterial',
  'systemThickMaterial',
  'systemChromeMaterial',
  'systemUltraThinMaterialLight',
  'systemThinMaterialLight',
  'systemMaterialLight',
  'systemThickMaterialLight',
  'systemChromeMaterialLight',
  'systemUltraThinMaterialDark',
  'systemThinMaterialDark',
  'systemMaterialDark',
  'systemThickMaterialDark',
  'systemChromeMaterialDark',
];

const COLOR_VALUES = {
  white: '#ffffff',
  navy: '#001a72',
  translucent: '#ff00ff40',
} as const;

const STRIPES = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#007aff',
  '#af52de',
];

type Config = {
  kind: EffectKind;
  fillColor: FillColor;
  blurStyle: FormSheetBackgroundEffectBlurStyle;
};

function buildEffect(config: Config): FormSheetBackgroundEffect {
  switch (config.kind) {
    case 'automatic':
      return 'automatic';
    case 'none':
      return 'none';
    case 'color':
      return { type: 'color', color: COLOR_VALUES[config.fillColor] };
    case 'blur':
      return { type: 'blur', style: config.blurStyle };
  }
}

function describeEffect(effect: FormSheetBackgroundEffect): string {
  return typeof effect === 'string' ? effect : JSON.stringify(effect);
}

function TestFormSheetBackgroundEffect() {
  const [isOpen, setIsOpen] = useState(false);
  const [containerColor, setContainerColor] = useState<ContainerColor>('none');
  const [config, setConfig] = useState<Config>({
    kind: 'automatic',
    fillColor: 'white',
    blurStyle: 'systemMaterial',
  });

  const effect = buildEffect(config);

  const nativeContainerStyle =
    containerColor === 'none'
      ? undefined
      : { backgroundColor: COLOR_VALUES[containerColor] };

  const update =
    <K extends keyof Config>(key: K) =>
    (value: Config[K]) =>
      setConfig(current => ({ ...current, [key]: value }));

  return (
    <View style={styles.container}>
      <View style={styles.stripes} pointerEvents="none">
        {STRIPES.map(color => (
          <View
            key={color}
            style={[styles.stripe, { backgroundColor: color }]}
          />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.controls}>
        <Text style={styles.title}>FormSheet Background Effect</Text>
        <SettingsPicker
          label="effect"
          value={config.kind}
          onValueChange={update('kind')}
          items={EFFECT_KINDS}
        />
        {config.kind === 'color' && (
          <SettingsPicker
            label="color"
            value={config.fillColor}
            onValueChange={update('fillColor')}
            items={FILL_COLORS}
          />
        )}
        {config.kind === 'blur' && (
          <SettingsPicker
            label="blur style"
            value={config.blurStyle}
            onValueChange={update('blurStyle')}
            items={BLUR_STYLES}
          />
        )}
        <SettingsPicker
          label="container color"
          value={containerColor}
          onValueChange={setContainerColor}
          items={CONTAINER_COLORS}
        />
        <Button
          title="Open FormSheet"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
      </ScrollView>
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={DETENTS}
        prefersGrabberVisible
        nativeContainerStyle={nativeContainerStyle}
        backgroundEffect={effect}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetText}>{describeEffect(effect)}</Text>
          <SettingsPicker
            label="effect"
            value={config.kind}
            onValueChange={update('kind')}
            items={EFFECT_KINDS}
          />
          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={() => setIsOpen(false)}
          />
        </View>
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stripes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stripe: {
    flex: 1,
  },
  controls: {
    paddingTop: 80,
    paddingBottom: 24,
    paddingHorizontal: 12,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.text,
  },
  sheetContent: {
    flex: 1,
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text,
  },
});

export default createScenario(
  TestFormSheetBackgroundEffect,
  scenarioDescription,
);
