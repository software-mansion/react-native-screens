import React, { ReactNode, Ref } from 'react';
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

type ViewRef = React.ElementRef<typeof NativeSearchBar>;

type SearchBarCommandsType = {
  blur: (viewRef: ViewRef) => void;
  focus: (viewRef: ViewRef) => void;
  clearText: (viewRef: ViewRef) => void;
  toggleCancelButton: (viewRef: ViewRef, flag: boolean) => void;
  setText: (viewRef: ViewRef, text: string) => void;
  cancelSearch: (viewRef: ViewRef) => void;
};

function ImplSearchBar(props: SearchBarProps, ref: Ref<SearchBarCommands>) {
  const implRef = React.useRef<SearchBarCommands | null>(null);

  React.useImperativeHandle(ref, () => ({
    blur: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
    },
    focus: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
    },
    toggleCancelButton: (flag: boolean) => {
      _callMethodWithRef(ref =>
        NativeSearchBarCommands.toggleCancelButton(ref, flag)
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
      const ref = implRef.current;
      if (ref) {
        method(ref);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet'
        );
      }
    },
    [implRef]
  );

  if (!isSearchBarAvailableForCurrentPlatform) {
    console.warn(
      'Importing SearchBar is only valid on iOS and Android devices.'
    );
    return View as unknown as ReactNode;
  }

  return <NativeSearchBar {...props} ref={implRef} />;
}

export default React.forwardRef<SearchBarCommands, SearchBarProps>(
  ImplSearchBar
);
