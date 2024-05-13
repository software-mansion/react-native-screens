import React, { ReactNode } from 'react';
import {
  isSearchBarAvailableForCurrentPlatform,
  SearchBarCommands,
  SearchBarProps,
} from 'react-native-screens';
import { View } from 'react-native';

// Native components
import SearchBarNativeComponent, {
  Commands as SearchBarNativeCommands,
} from '../fabric/SearchBarNativeComponent';

export const NativeSearchBar: React.ComponentType<SearchBarProps> &
  typeof NativeSearchBarCommands =
  SearchBarNativeComponent as unknown as React.ComponentType<SearchBarProps> &
    SearchBarCommandsType;
export const NativeSearchBarCommands: SearchBarCommandsType =
  SearchBarNativeCommands as SearchBarCommandsType;

type SearchBarCommandsType = {
  blur: (viewRef: React.ElementRef<typeof NativeSearchBar>) => void;
  focus: (viewRef: React.ElementRef<typeof NativeSearchBar>) => void;
  clearText: (viewRef: React.ElementRef<typeof NativeSearchBar>) => void;
  toggleCancelButton: (
    viewRef: React.ElementRef<typeof NativeSearchBar>,
    flag: boolean
  ) => void;
  setText: (
    viewRef: React.ElementRef<typeof NativeSearchBar>,
    text: string
  ) => void;
  cancelSearch: (viewRef: React.ElementRef<typeof NativeSearchBar>) => void;
};

const SearchBar = React.forwardRef<SearchBarCommands, SearchBarProps>(
  function SearchBar(props, ref) {
    const nativeSearchBarRef = React.useRef<SearchBarCommands | null>(null!);
    React.useImperativeHandle(ref, () => ({
      ...nativeSearchBarRef.current,
      blur,
      focus,
      toggleCancelButton,
      clearText,
      setText,
      cancelSearch,
    }));

    function _callMethodWithRef(method: (ref: SearchBarCommands) => void) {
      const ref = nativeSearchBarRef.current;
      if (ref) {
        method(ref);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet'
        );
      }
    }

    function blur() {
      _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
    }

    function focus() {
      _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
    }

    function toggleCancelButton(flag: boolean) {
      _callMethodWithRef(ref =>
        NativeSearchBarCommands.toggleCancelButton(ref, flag)
      );
    }

    function clearText() {
      _callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
    }

    function setText(text: string) {
      _callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
    }

    function cancelSearch() {
      _callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
    }

    if (!isSearchBarAvailableForCurrentPlatform) {
      console.warn(
        'Importing SearchBar is only valid on iOS and Android devices.'
      );
      return View as unknown as ReactNode;
    }

    return <NativeSearchBar {...props} ref={nativeSearchBarRef} />;
  }
);

export default SearchBar;
