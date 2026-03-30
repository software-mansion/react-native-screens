import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SplitScreen, SplitView } from 'react-native-screens/experimental';
import { SplitBaseConfig } from './helpers/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StackEntry = { key: string; title: string; bg: string };

// ---------------------------------------------------------------------------
// Screen content components
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'food', label: 'Food & Drink', bg: '#C0392B' },
  { id: 'travel', label: 'Travel', bg: '#2980B9' },
  { id: 'tech', label: 'Technology', bg: '#27AE60' },
  { id: 'sports', label: 'Sports', bg: '#8E44AD' },
];

const CategoryListContent = ({
  onSelectCategory,
}: {
  onSelectCategory: (title: string, bg: string) => void;
}) => (
  <ScrollView contentContainerStyle={styles.listContent}>
    <Text style={styles.sectionHeader}>Select a category</Text>
    {CATEGORIES.map(cat => (
      <View key={cat.id} style={[styles.listItem, { borderLeftColor: cat.bg }]}>
        <Text style={styles.listItemLabel}>{cat.label}</Text>
        <Button
          title="Open"
          color={cat.bg}
          onPress={() => onSelectCategory(cat.label, cat.bg)}
        />
      </View>
    ))}
  </ScrollView>
);

const CategoryDetailContent = ({ title }: { title: string }) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>Detailed information about {title}.</Text>
  </View>
);

const SupplementaryContent = ({
  title,
  isTop,
  onPush,
}: {
  title: string;
  isTop: boolean;
  onPush: () => void;
}) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>Supplementary column — additional context.</Text>
    {isTop && <Button title="Push Details" onPress={onPush} />}
  </View>
);

const SecondaryContent = ({
  title,
  isTop,
  showInspector,
  onToggleInspector,
  onPush,
}: {
  title: string;
  isTop: boolean;
  showInspector: boolean;
  onToggleInspector: () => void;
  onPush: () => void;
}) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>Secondary column — main content area.</Text>
    {isTop && (
      <View style={styles.buttonGroup}>
        <Button title="Push Sub-content" onPress={onPush} />
        <Button
          title={showInspector ? 'Hide Inspector' : 'Show Inspector'}
          onPress={onToggleInspector}
        />
      </View>
    )}
  </View>
);

const InspectorContent = ({
  title,
  isTop,
  onPush,
}: {
  title: string;
  isTop: boolean;
  onPush: () => void;
}) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>Metadata and attributes for the selected item.</Text>
    <View style={styles.metaBlock}>
      <Text style={styles.metaLabel}>Type</Text>
      <Text style={styles.metaValue}>Document</Text>
    </View>
    <View style={styles.metaBlock}>
      <Text style={styles.metaLabel}>Modified</Text>
      <Text style={styles.metaValue}>Today, 12:34</Text>
    </View>
    {isTop && <Button title="Push Inspector Detail" onPress={onPush} />}
  </View>
);

// ---------------------------------------------------------------------------
// SplitBaseApp
// ---------------------------------------------------------------------------

const SplitBaseApp = ({
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  const [primaryStack, setPrimaryStack] = React.useState<StackEntry[]>([
    { key: 'primary-root', title: 'Categories', bg: '#2C3E50' },
  ]);
  const [suppStack, setSuppStack] = React.useState<StackEntry[]>([
    { key: 'supp-root', title: 'Overview', bg: '#16A085' },
  ]);
  const [secondaryStack, setSecondaryStack] = React.useState<StackEntry[]>([
    { key: 'secondary-root', title: 'Content', bg: '#6C3483' },
  ]);
  const [inspectorStack, setInspectorStack] = React.useState<StackEntry[]>([
    { key: 'inspector-root', title: 'Inspector', bg: '#A04000' },
  ]);
  const [showInspector, setShowInspector] = React.useState(false);

  const makeNativeDismissHandler =
    (setter: React.Dispatch<React.SetStateAction<StackEntry[]>>) =>
    (key: string) =>
      setter(prev => prev.filter(s => s.key !== key));

  return (
    <SplitView {...splitBaseConfig} showInspector={showInspector}>
      {/* ---- Primary: category list → category detail ---- */}
      <SplitView.Primary>
        {primaryStack.map((screen, index) => (
          <SplitScreen
            key={screen.key}
            screenKey={screen.key}
            activityMode="attached"
            title={screen.title}
            headerBackgroundColor={screen.bg}
            onNativeDismiss={makeNativeDismissHandler(setPrimaryStack)}>
            {index === 0 ? (
              <CategoryListContent
                onSelectCategory={(title, bg) =>
                  setPrimaryStack(prev => [
                    ...prev,
                    { key: `primary-${prev.length}`, title, bg },
                  ])
                }
              />
            ) : (
              <CategoryDetailContent title={screen.title} />
            )}
          </SplitScreen>
        ))}
      </SplitView.Primary>

      {/* ---- Supplementary: overview → details ---- */}
      <SplitView.Supplementary>
        {suppStack.map((screen, index) => (
          <SplitScreen
            key={screen.key}
            screenKey={screen.key}
            activityMode="attached"
            title={screen.title}
            headerBackgroundColor={screen.bg}
            onNativeDismiss={makeNativeDismissHandler(setSuppStack)}>
            <SupplementaryContent
              title={screen.title}
              isTop={index === suppStack.length - 1}
              onPush={() =>
                setSuppStack(prev => [
                  ...prev,
                  {
                    key: `supp-${prev.length}`,
                    title: `Details #${prev.length}`,
                    bg: '#1ABC9C',
                  },
                ])
              }
            />
          </SplitScreen>
        ))}
      </SplitView.Supplementary>

      {/* ---- Secondary: main content + inspector toggle ---- */}
      <SplitView.Secondary>
        {secondaryStack.map((screen, index) => (
          <SplitScreen
            key={screen.key}
            screenKey={screen.key}
            activityMode="attached"
            title={screen.title}
            headerBackgroundColor={screen.bg}
            onNativeDismiss={makeNativeDismissHandler(setSecondaryStack)}>
            <SecondaryContent
              title={screen.title}
              isTop={index === secondaryStack.length - 1}
              showInspector={showInspector}
              onToggleInspector={() => setShowInspector(v => !v)}
              onPush={() =>
                setSecondaryStack(prev => [
                  ...prev,
                  {
                    key: `secondary-${prev.length}`,
                    title: `Sub-content #${prev.length}`,
                    bg: '#9B59B6',
                  },
                ])
              }
            />
          </SplitScreen>
        ))}
      </SplitView.Secondary>

      {/* ---- Inspector: metadata panel (iOS 26+) ---- */}
      <SplitView.Inspector>
        {inspectorStack.map((screen, index) => (
          <SplitScreen
            key={screen.key}
            screenKey={screen.key}
            activityMode="attached"
            title={screen.title}
            headerBackgroundColor={screen.bg}
            onNativeDismiss={makeNativeDismissHandler(setInspectorStack)}>
            <InspectorContent
              title={screen.title}
              isTop={index === inspectorStack.length - 1}
              onPush={() =>
                setInspectorStack(prev => [
                  ...prev,
                  {
                    key: `inspector-${prev.length}`,
                    title: `Inspector #${prev.length}`,
                    bg: '#E67E22',
                  },
                ])
              }
            />
          </SplitScreen>
        ))}
      </SplitView.Inspector>
    </SplitView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderLeftWidth: 4,
  },
  listItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  metaBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD',
  },
  metaLabel: {
    fontSize: 14,
    color: '#888',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SplitBaseApp;
