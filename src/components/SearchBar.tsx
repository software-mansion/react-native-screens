'use client';

import React from 'react';
import { SearchBarProps } from '../types';
import {
  parseBooleanToOptionalBooleanNativeProp,
  isSearchBarAvailableForCurrentPlatform,
} from '../utils';
import { View } from 'react-native';

// Native components
import SearchBarNativeComponent, {
  Commands as NativeSearchBarCommands,
  SearchBarEvent,
  SearchButtonPressedEvent,
  ChangeTextEvent,
} from '../fabric/SearchBarNativeComponent';
import type { CodegenTypes as CT } from 'react-native';

type SearchBarHostInstance = React.ComponentRef<
  typeof SearchBarNativeComponent
>;

function SearchBar(props: SearchBarProps) {
  const searchBarRef = React.useRef<SearchBarHostInstance | null>(null);

  React.useImperativeHandle(props.ref, () => ({
    blur: () => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.blur(instance),
      );
    },
    focus: () => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.focus(instance),
      );
    },
    toggleCancelButton: (flag: boolean) => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.toggleCancelButton(instance, flag),
      );
    },
    clearText: () => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.clearText(instance),
      );
    },
    setText: (text: string) => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.setText(instance, text),
      );
    },
    cancelSearch: () => {
      callWithNativeInstance(instance =>
        NativeSearchBarCommands.cancelSearch(instance),
      );
    },
  }));

  const callWithNativeInstance = React.useCallback(
    (command: (instance: SearchBarHostInstance) => void) => {
      const instance = searchBarRef.current;
      if (instance) {
        command(instance);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet',
        );
      }
    },
    [searchBarRef],
  );

  if (!isSearchBarAvailableForCurrentPlatform) {
    console.warn(
      'Importing SearchBar is only valid on iOS and Android devices.',
    );
    return View as unknown as React.ReactNode;
  }

  const {
    obscureBackground,
    hideNavigationBar,
    onFocus,
    onBlur,
    onSearchButtonPress,
    onCancelButtonPress,
    onChangeText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
    ...rest
  } = props;

  return (
    <SearchBarNativeComponent
      ref={searchBarRef}
      {...rest}
      obscureBackground={parseBooleanToOptionalBooleanNativeProp(
        obscureBackground,
      )}
      hideNavigationBar={parseBooleanToOptionalBooleanNativeProp(
        hideNavigationBar,
      )}
      onSearchFocus={onFocus as CT.DirectEventHandler<SearchBarEvent>}
      onSearchBlur={onBlur as CT.DirectEventHandler<SearchBarEvent>}
      onSearchButtonPress={
        onSearchButtonPress as CT.DirectEventHandler<SearchButtonPressedEvent>
      }
      onCancelButtonPress={
        onCancelButtonPress as CT.DirectEventHandler<SearchBarEvent>
      }
      onChangeText={onChangeText as CT.DirectEventHandler<ChangeTextEvent>}
    />
  );
}

export default SearchBar;
