import React, { useRef, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import {
  ScrollViewMarker,
  SearchBar,
  Stack,
  type SearchBarCommands,
} from 'react-native-screens';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackSearchBarIOS() {
  return (
    <StackContainer
      routeConfigs={[
        { name: 'Home', element: <SearchScreen name="Home" /> },
        { name: 'Search', element: <SearchScreen name="Search" /> },
        { name: 'Details', element: <DetailsScreen /> },
      ]}
    />
  );
}

function SearchScreen({ name }: { name: string }) {
  const navigation = useStackNavigationContext();
  const searchRef = useRef<SearchBarCommands>(null);
  const [mounted, setMounted] = useState(true);
  const [headerMounted, setHeaderMounted] = useState(true);
  const [version, setVersion] = useState(0);
  const [hideWhenScrolling, setHideWhenScrolling] = useState(false);
  const [placement, setPlacement] = useState<'stacked' | 'automatic'>(
    'stacked',
  );
  const [focusEvent, setFocusEvent] = useState<'none' | 'focus' | 'blur'>(
    'none',
  );
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [cancelCount, setCancelCount] = useState(0);
  const [filterCount, setFilterCount] = useState(0);

  return (
    <>
      {headerMounted && (
        <Stack.HeaderConfig
          title={name}
          ios={{
            searchBar: mounted ? (
              <SearchBar
                key={version}
                ref={searchRef}
                placeholder={`${name} search ${version}`}
                placement={placement}
                hideWhenScrolling={hideWhenScrolling}
                obscureBackground={false}
                hideNavigationBar={false}
                onFocus={() => setFocusEvent('focus')}
                onBlur={() => setFocusEvent('blur')}
                onChangeText={event => setText(event.nativeEvent.text)}
                onSearchButtonPress={event =>
                  setSubmitted(event.nativeEvent.text ?? '')
                }
                onCancelButtonPress={() => setCancelCount(count => count + 1)}
              />
            ) : undefined,
            trailingItems: [
              {
                type: 'item',
                id: 'filters',
                title: 'Filters',
                menu: {
                  type: 'menu',
                  id: 'filter-menu',
                  children: [
                    {
                      type: 'menuItem',
                      id: 'apply-filter',
                      title: 'Apply filter',
                      onPress: () => setFilterCount(count => count + 1),
                    },
                    {
                      type: 'menuItem',
                      id: 'toggle-search-scrolling',
                      title: 'Toggle hide when scrolling',
                      onPress: () => setHideWhenScrolling(value => !value),
                    },
                  ],
                },
              },
            ],
          }}
        />
      )}
      <ScrollViewMarker style={{ flex: 1 }}>
        <ScrollView
          testID="search-controls"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ padding: 16, gap: 8 }}>
          <Text testID="search-screen-name">{name}</Text>
          <Text testID="search-focus">Last focus event: {focusEvent}</Text>
          <Text testID="search-text">Text: {text}</Text>
          <Text testID="search-submit">Submitted: {submitted}</Text>
          <Text testID="search-cancel">Cancelled: {cancelCount}</Text>
          <Text testID="filter-count">Filters: {filterCount}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button
              testID="focus-search"
              title="Focus search"
              onPress={() => searchRef.current?.focus()}
            />
            <Button
              testID="blur-search"
              title="Blur search"
              onPress={() => searchRef.current?.blur()}
            />
            <Button
              testID="push-details"
              title="Push without search"
              onPress={() => navigation.push('Details')}
            />
            <Button
              testID="push-search"
              title="Push another search"
              onPress={() => navigation.push('Search')}
            />
            {name !== 'Home' && (
              <Button
                testID="pop-search"
                title="Go back"
                onPress={() => navigation.pop(navigation.routeKey)}
              />
            )}
            <Button
              testID="set-search-text"
              title="Set text"
              onPress={() => searchRef.current?.setText('native command')}
            />
            <Button
              testID="clear-search-text"
              title="Clear text"
              onPress={() => searchRef.current?.clearText()}
            />
            <Button
              testID="cancel-search"
              title="Cancel search"
              onPress={() => searchRef.current?.cancelSearch()}
            />
            <Button
              testID="show-cancel"
              title="Show cancel button"
              onPress={() => searchRef.current?.toggleCancelButton(true)}
            />
            <Button
              testID="hide-cancel"
              title="Hide cancel button"
              onPress={() => searchRef.current?.toggleCancelButton(false)}
            />
            <Button
              testID="replace-search"
              title="Replace search"
              onPress={() => setVersion(value => value + 1)}
            />
            <Button
              testID="toggle-search"
              title={mounted ? 'Remove search' : 'Mount search'}
              onPress={() => setMounted(value => !value)}
            />
            <Button
              testID="toggle-header"
              title={headerMounted ? 'Remove header' : 'Mount header'}
              onPress={() => setHeaderMounted(value => !value)}
            />
            <Button
              testID="toggle-scroll"
              title={`Hide when scrolling: ${String(hideWhenScrolling)}`}
              onPress={() => setHideWhenScrolling(value => !value)}
            />
            <Button
              testID="toggle-placement"
              title={`Placement: ${placement}`}
              onPress={() =>
                setPlacement(value =>
                  value === 'stacked' ? 'automatic' : 'stacked',
                )
              }
            />
          </View>
          {Array.from({ length: 12 }, (_, index) => (
            <Text key={index}>Result {index + 1}</Text>
          ))}
        </ScrollView>
      </ScrollViewMarker>
    </>
  );
}

function DetailsScreen() {
  const navigation = useStackNavigationContext();
  return (
    <>
      <Stack.HeaderConfig title="Details" />
      <Button
        testID="pop-details"
        title="Go back"
        onPress={() => navigation.pop(navigation.routeKey)}
      />
    </>
  );
}

export default createScenario(TestStackSearchBarIOS, scenarioDescription);
