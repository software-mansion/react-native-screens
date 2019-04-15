import debounce from 'debounce';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

let _shouldUseScreens = true;

export function useScreens(shouldUseScreens = true) {
  if (shouldUseScreens) {
    console.warn(
      'react-native-screens is not fully support on this platform yet.'
    );
  }
  _shouldUseScreens = shouldUseScreens;
}

export function screensEnabled() {
  return _shouldUseScreens;
}

function isAnimatedValue(value) {
  return value && value.__getValue && value.addListener;
}

function isPropTruthy(prop) {
  let activeValue = prop;
  if (isAnimatedValue(prop)) {
    activeValue = !!prop.__getValue();
  }

  return activeValue !== undefined && activeValue;
}

export class Screen extends React.Component {
  listenerId = null;

  state = { isActive: null };

  constructor(props) {
    super(props);

    this._onAnimatedValueUpdated = debounce(this._onAnimatedValueUpdated, 10);

    this._addListener(props.active);

    this.state = {
      isActive: isPropTruthy(props.active),
    };
  }

  componentWillUnmount() {
    this._removeListener(this.props.active);
  }

  _addListener = possibleListener => {
    if (isAnimatedValue(possibleListener)) {
      this.listenerId = possibleListener.addListener(
        this._onAnimatedValueUpdated
      );
    }
  };

  _removeListener = possibleListener => {
    if (isAnimatedValue(possibleListener)) {
      possibleListener.removeListener(this.listenerId);
      this.listenerId = null;
    }
  };

  componentWillReceiveProps({ active: nextActive }) {
    const { active } = this.props;
    if (nextActive !== active) {
      this._removeListener(active);
      this._addListener(nextActive);

      this.setState({
        isActive: isPropTruthy(nextActive),
      });
    }
  }

  _onAnimatedValueUpdated = ({ value }) => {
    if (this.state.isActive !== !!value) {
      this.setState({ isActive: !!value });
    }
  };

  render() {
    const { style, ...rest } = this.props;
    const { isActive } = this.state;
    let viewStyle = style;

    if (!isActive) {
      viewStyle = [style, styles.none];
    }

    return <Animated.View {...rest} style={viewStyle} />;
  }
}

export const ScreenContainer = View;

export const NativeScreen = View;

export const NativeScreenContainer = View;

const styles = StyleSheet.create({
  none: {
    display: 'none',
  },
});
