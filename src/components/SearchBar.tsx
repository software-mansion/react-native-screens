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
  typeof NativeSearchBarCommands = SearchBarNativeComponent as any;
export const NativeSearchBarCommands: SearchBarCommandsType =
  SearchBarNativeCommands as any;

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

class SearchBar extends React.Component<SearchBarProps> {
  nativeSearchBarRef: React.RefObject<SearchBarCommands>;

  constructor(props: SearchBarProps) {
    super(props);
    this.nativeSearchBarRef = React.createRef();
  }

  _callMethodWithRef(method: (ref: SearchBarCommands) => void) {
    const ref = this.nativeSearchBarRef.current;
    if (ref) {
      method(ref);
    } else {
      console.warn(
        'Reference to native search bar component has not been updated yet'
      );
    }
  }

  blur() {
    this._callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
  }

  focus() {
    this._callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
  }

  toggleCancelButton(flag: boolean) {
    this._callMethodWithRef(ref =>
      NativeSearchBarCommands.toggleCancelButton(ref, flag)
    );
  }

  clearText() {
    this._callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
  }

  setText(text: string) {
    this._callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
  }

  cancelSearch() {
    this._callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
  }

  render() {
    if (!isSearchBarAvailableForCurrentPlatform) {
      console.warn(
        'Importing SearchBar is only valid on iOS and Android devices.'
      );
      return View as any as ReactNode;
    }

    return <NativeSearchBar {...this.props} ref={this.nativeSearchBarRef} />;
  }
}

export default SearchBar;
