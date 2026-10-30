import React, { useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import {
  ScreenStack,
  ScreenStackHeaderSearchBarView,
  ScreenStackItem,
  SearchBar,
} from 'react-native-screens';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

type Spacing = 0 | -0.9 | 2 | undefined;

const isIOS = Platform.OS === 'ios';

const nextSpacing = (value: Spacing): Spacing =>
  value === undefined ? 0 : value === 0 ? -0.9 : value === -0.9 ? 2 : undefined;

function TestStackV4HeaderLetterSpacing() {
  const [spacing, setSpacing] = useState<Spacing>(undefined);
  const [applyToTitle, setApplyToTitle] = useState(true);
  const [applyToLargeTitle, setApplyToLargeTitle] = useState(true);
  const [applyToBackTitle, setApplyToBackTitle] = useState(true);
  const [applyToBarButton, setApplyToBarButton] = useState(true);
  const [largeTitle, setLargeTitle] = useState(true);
  const [customTypography, setCustomTypography] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [longBackTitle, setLongBackTitle] = useState(false);
  const [disableBackButtonMenu, setDisableBackButtonMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const titleLetterSpacing = applyToTitle ? spacing : undefined;

  const controls = (
    <>
      <Text>Spacing: {spacing ?? 'omitted'}</Text>
      <Button
        title="Cycle spacing: omitted / 0 / -0.9 / 2"
        onPress={() => setSpacing(nextSpacing)}
      />
      <SettingsSwitch
        label="Apply to title"
        value={applyToTitle}
        onValueChange={setApplyToTitle}
      />
      <SettingsSwitch
        label="Apply to large title (iOS)"
        value={applyToLargeTitle}
        onValueChange={setApplyToLargeTitle}
      />
      <SettingsSwitch
        label="Apply to back title (iOS)"
        value={applyToBackTitle}
        onValueChange={setApplyToBackTitle}
      />
      <SettingsSwitch
        label="Apply to bar button item (iOS)"
        value={applyToBarButton}
        onValueChange={setApplyToBarButton}
      />
      <SettingsSwitch
        label="Custom typography"
        value={customTypography}
        onValueChange={setCustomTypography}
      />
    </>
  );

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="letter-spacing-home"
        style={StyleSheet.absoluteFill}
        unstable_safeAreaEdges={{ top: !isIOS }}
        headerConfig={{
          title: longBackTitle
            ? 'Letter Spacing With A Much Longer Title'
            : 'Letter Spacing',
          largeTitle,
          // On iOS 26+, an opaque bar covers the large title hosted in the scroll view.
          translucent: isIOS,
          backgroundColor: isIOS ? 'transparent' : undefined,
          headerRightBarButtonItems: [
            {
              type: 'button',
              title: 'Edit',
              titleStyle: {
                letterSpacing: applyToBarButton ? spacing : undefined,
              },
              onPress: () => {},
            },
          ],
          titleLetterSpacing,
          titleFontSize: customTypography ? 20 : undefined,
          titleFontWeight: customTypography ? '600' : undefined,
          largeTitleLetterSpacing: applyToLargeTitle ? spacing : undefined,
          largeTitleFontSize: customTypography ? 30 : undefined,
          largeTitleFontWeight: customTypography ? '700' : undefined,
          children: searchBar ? (
            <ScreenStackHeaderSearchBarView>
              <SearchBar hideWhenScrolling />
            </ScreenStackHeaderSearchBarView>
          ) : undefined,
        }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic">
          {controls}
          <SettingsSwitch
            label="Large title (iOS)"
            value={largeTitle}
            onValueChange={setLargeTitle}
          />
          <SettingsSwitch
            label="Search bar (iOS)"
            value={searchBar}
            onValueChange={setSearchBar}
          />
          <SettingsSwitch
            label="Long title (iOS back title shortening)"
            value={longBackTitle}
            onValueChange={setLongBackTitle}
          />
          <SettingsSwitch
            label="Disable back button menu (iOS)"
            value={disableBackButtonMenu}
            onValueChange={setDisableBackButtonMenu}
          />
          <Button title="Push details" onPress={() => setShowDetails(true)} />
          {Array.from({ length: 40 }, (_, index) => (
            <Text key={index} style={styles.row}>
              Row {index + 1} — scroll to collapse the large title
            </Text>
          ))}
          <Button
            title="Push details with collapsed title"
            onPress={() => setShowDetails(true)}
          />
        </ScrollView>
      </ScreenStackItem>
      {showDetails && (
        <ScreenStackItem
          screenId="letter-spacing-details"
          style={StyleSheet.absoluteFill}
          nativeBackButtonDismissalEnabled
          onDismissed={() => setShowDetails(false)}
          headerConfig={{
            title: 'Details',
            largeTitle: false,
            titleLetterSpacing,
            titleFontSize: customTypography ? 20 : undefined,
            titleFontWeight: customTypography ? '600' : undefined,
            backTitleLetterSpacing: applyToBackTitle ? spacing : undefined,
            backTitleFontSize: customTypography ? 17 : undefined,
            disableBackButtonMenu,
          }}>
          <ScrollView contentContainerStyle={styles.content}>
            {controls}
            <Text>
              Swipe back slowly, cancel once, then complete. The previous title
              should keep its spacing. Also try the native back button.
            </Text>
          </ScrollView>
        </ScreenStackItem>
      )}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  row: {
    paddingVertical: 12,
  },
});

export default createScenario(
  TestStackV4HeaderLetterSpacing,
  scenarioDescription,
);
