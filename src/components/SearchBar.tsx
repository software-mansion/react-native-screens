'use client';

import React from 'react';
import { SearchBarCommands, SearchBarProps } from '../types';
import {
  parseBooleanToOptionalBooleanNativeProp,
  isSearchBarAvailableForCurrentPlatform,
} from '../utils';
import { View } from 'react-native';

// Native components
import SearchBarNativeComponent, {
  Commands as SearchBarNativeCommands,
  NativeProps as SearchBarNativeProps,
  SearchBarEvent,
  SearchButtonPressedEvent,
  ChangeTextEvent,
} from '../fabric/SearchBarNativeComponent';
import type { CodegenTypes as CT } from 'react-native';

const NativeSearchBar: React.ComponentType<
  SearchBarNativeProps & {
    ref?: React.RefObject<SearchBarCommands | null> | undefined;
  }
> &
  typeof NativeSearchBarCommands =
  SearchBarNativeComponent as unknown as React.ComponentType<SearchBarNativeProps> &
    SearchBarCommandsType;
const NativeSearchBarCommands: SearchBarCommandsType =
  SearchBarNativeCommands as SearchBarCommandsType;

type NativeSearchBarRef = React.ComponentRef<typeof NativeSearchBar>;

type SearchBarCommandsType = {
  blur: (viewRef: NativeSearchBarRef) => void;
  focus: (viewRef: NativeSearchBarRef) => void;
  clearText: (viewRef: NativeSearchBarRef) => void;
  toggleCancelButton: (viewRef: NativeSearchBarRef, flag: boolean) => void;
  setText: (viewRef: NativeSearchBarRef, text: string) => void;
  cancelSearch: (viewRef: NativeSearchBarRef) => void;
};

function SearchBar(
  props: SearchBarProps,
  forwardedRef: React.Ref<SearchBarCommands>,
) {
  const searchBarRef = React.useRef<SearchBarCommands>(null);

  React.useImperativeHandle(forwardedRef, () => ({
    blur: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
    },
    focus: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
    },
    toggleCancelButton: (flag: boolean) => {
      _callMethodWithRef(ref =>
        NativeSearchBarCommands.toggleCancelButton(ref, flag),
      );
    },
    clearText: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
    },
    setText: (text: string) => {
      _callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
    },
    cancelSearch: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
    },
  }));

  const _callMethodWithRef = React.useCallback(
    (method: (ref: SearchBarCommands) => void) => {
      const ref = searchBarRef.current;
      if (ref) {
        method(ref);
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
    ...rest
  } = props;

  return (
    <NativeSearchBar
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

export default React.forwardRef<SearchBarCommands, SearchBarProps>(SearchBar);
