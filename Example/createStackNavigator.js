import React from 'react';
import { StyleSheet } from 'react-native';
import {
  StackRouter,
  SceneView,
  StackActions,
  NavigationActions,
  createNavigator,
} from '@react-navigation/core';
import { createKeyboardAwareNavigator } from '@react-navigation/native';
import { ScreenStack, Screen } from 'react-native-screens';

import NavigationScenesReducer from '../views/ScenesReducer';

class StackView extends React.Component {
  _removeScene = scene => {
    const { navigation } = this.props;
    navigation.dispatch(
      NavigationActions.back({
        key: scene.route.key,
        immediate: true,
      })
    );
    navigation.dispatch(StackActions.completeTransition());
  };

  _renderScene = scene => {
    const { navigation, getComponent } = scene.descriptor;
    const SceneComponent = getComponent();

    const { screenProps } = this.props;
    return (
      <Screen
        key={`screen_${scene.key}`}
        style={StyleSheet.absoluteFill}
        onDismissed={() => this._removeScene(scene)}>
        <SceneView
          screenProps={screenProps}
          navigation={navigation}
          component={SceneComponent}
        />
      </Screen>
    );
  };

  render() {
    const scenes = NavigationScenesReducer(
      [],
      this.props.navigation.state,
      null,
      this.props.descriptors
    );

    return (
      <ScreenStack style={styles.scenes}>
        {scenes.map(this._renderScene)}
      </ScreenStack>
    );
  }
}

const styles = StyleSheet.create({
  scenes: { flex: 1 },
});

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);

  // Create a navigator with StackView as the view
  let Navigator = createNavigator(StackView, router, stackConfig);
  if (!stackConfig.disableKeyboardHandling) {
    Navigator = createKeyboardAwareNavigator(Navigator, stackConfig);
  }

  return Navigator;
}

export default createStackNavigator;
