import * as React from 'react';
import ScreenNativeComponent from './ScreenNativeComponent';
import { StyleSheet } from 'react-native';
import ScreenStateContext from './ScreenStateContext';

class Screen extends React.Component {
  static contextType = ScreenStateContext;

  componentWillUnmount() {
    console.log('Unmount');
    this.context?.onWillScreenUnmount();
  }

  render() {
    return (
      <ScreenNativeComponent
        {...this.props}
        style={[this.props.style, StyleSheet.absoluteFill]}
      />
    );
  }
}

export default Screen;
