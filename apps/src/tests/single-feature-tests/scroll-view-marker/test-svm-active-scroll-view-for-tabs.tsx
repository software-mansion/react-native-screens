import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Scenario } from '../../shared/helpers';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { TabsContainer } from '../../../shared/gamma/containers/tabs';
import { Rectangle } from '../../../shared/Rectangle';
import Colors from '../../../shared/styling/Colors';
import { generateNextColor } from '../../../shared/utils/color-generator';

const SCENARIO: Scenario = {
  name: 'Active marker for tabs',
  key: 'test-svm-active-scroll-view-for-tabs',
  details:
    'Reproduces nested tab content where multiple descendant ScrollViews stay mounted under a non-scroll wrapper. ' +
    'Switch pages with the buttons and verify that tab bar minimize behavior follows the active ScrollViewMarker ' +
    'instead of remaining attached to the first registered ScrollView.',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

const ITEM_COUNT = 24;

function App() {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'Journal',
          Component: JournalLikeScreen,
          options: {
            title: 'Journal',
            ios: {
              icon: { type: 'sfSymbol', name: 'book.closed' },
            },
          },
        },
        {
          name: 'Other',
          Component: PlaceholderTab,
          options: {
            title: 'Other',
            ios: {
              icon: { type: 'sfSymbol', name: 'square.grid.2x2' },
            },
          },
        },
      ]}
      ios={{
        tabBarMinimizeBehavior: 'onScrollDown',
      }}
    />
  );
}

function JournalLikeScreen() {
  const [activePage, setActivePage] = React.useState(0);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Nested content with active marker</Text>
        <View style={styles.controls}>
          <PageButton
            label="Day 1"
            selected={activePage === 0}
            onPress={() => setActivePage(0)}
          />
          <PageButton
            label="Day 2"
            selected={activePage === 1}
            onPress={() => setActivePage(1)}
          />
        </View>
      </View>

      <View style={styles.pagerHost}>
        <Page
          active={activePage === 0}
          label="Day 1"
          accent={Colors.YellowLight100}
        />
        <Page
          active={activePage === 1}
          label="Day 2"
          accent={Colors.GreenLight100}
        />
      </View>
    </View>
  );
}

function PlaceholderTab() {
  return (
    <ScrollView contentContainerStyle={styles.placeholderScrollContent}>
      <Text style={styles.placeholderText}>Second tab placeholder</Text>
      {Array.from({ length: 20 }, (_, index) => (
        <Rectangle
          key={index}
          color={generateNextColor()}
          width={'100%'}
          height={88}
        />
      ))}
    </ScrollView>
  );
}

function Page(props: { active: boolean; label: string; accent: string }) {
  const { active, label, accent } = props;

  return (
    <View
      pointerEvents={active ? 'auto' : 'none'}
      style={[
        styles.pageContainer,
        { opacity: active ? 1 : 0, zIndex: active ? 1 : 0 },
      ]}>
      <ScrollViewMarker active={active} style={styles.fillParent}>
        <ScrollView
          style={styles.fillParent}
          contentContainerStyle={styles.scrollContent}>
          <View style={[styles.pageIntro, { borderColor: accent }]}>
            <Text style={styles.pageTitle}>{label}</Text>
            <Text style={styles.pageSubtitle}>
              Scroll this page after switching tabs. The tab bar should minimize
              using the currently active marker.
            </Text>
          </View>
          {Array.from({ length: ITEM_COUNT }, (_, index) => (
            <Rectangle
              key={`${label}-${index}`}
              color={generateNextColor()}
              width={'100%'}
              height={96}
            />
          ))}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

function PageButton(props: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { label, onPress, selected } = props;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected ? styles.buttonSelected : undefined]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  buttonSelected: {
    backgroundColor: '#CBD5E1',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pagerHost: {
    flex: 1,
  },
  pageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  pageIntro: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#475569',
  },
  placeholderScrollContent: {
    padding: 16,
    gap: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
