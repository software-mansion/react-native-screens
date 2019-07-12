import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  StackRouter,
  SceneView,
  StackActions,
  NavigationActions,
  createNavigator,
} from '@react-navigation/core';
import { createKeyboardAwareNavigator } from '@react-navigation/native';
import { ScenesReducer } from 'react-navigation-stack';
import {
  ScreenStack,
  Screen,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
} from 'react-native-screens';

class StackView extends React.Component {
  _removeScene = scene => {
    console.warn('REMOVE');
    const { navigation } = this.props;
    navigation.dispatch(
      NavigationActions.back({
        key: scene.route.key,
        immediate: true,
      })
    );
    navigation.dispatch(StackActions.completeTransition());
  };

  _renderHeaderConfig = scene => {
    const { navigationConfig } = this.props;
    const { options } = scene.descriptor;
    const { headerMode } = navigationConfig;

    const hasHeader = headerMode !== 'none' && options.header !== null;
    if (!hasHeader) {
      return <ScreenStackHeaderConfig hidden />;
    }

    const headerOptions = { translucent: false };
    const children = [];
    console.warn('OPTS', options);
    if (options.title !== undefined) {
      headerOptions.title = options.title;
    }
    if (options.headerStyle !== undefined) {
      headerOptions.backgroundColor = options.headerStyle.backgroundColor;
    }
    if (options.headerBackTitle !== undefined) {
      headerOptions.backTitle = options.headerBackTitle;
    }
    if (options.headerTintColor !== undefined) {
      headerOptions.color = options.headerTintColor;
    }
    if (options.headerBackImage !== undefined) {
      children.push(
        <ScreenStackHeaderLeftView>
          {options.headerBackImage}
        </ScreenStackHeaderLeftView>
      );
    }

    if (children.length > 0) {
      headerOptions.children = children;
    }

    return <ScreenStackHeaderConfig {...headerOptions} gestureEnabled={true} />;
  };

  _renderScene = scene => {
    const { navigation, getComponent } = scene.descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
    const SceneComponent = getComponent();

    let stackPresentation = 'push';
    if (mode === 'modal') {
      stackPresentation = transparentCard ? 'transparentModal' : 'modal';
    }

    const { screenProps } = this.props;
    return (
      <Screen
        key={`screen_${scene.key}`}
        style={StyleSheet.absoluteFill}
        stackPresentation={stackPresentation}
        onDismissed={() => this._removeScene(scene)}>
        {this._renderHeaderConfig(scene)}
        <SceneView
          screenProps={screenProps}
          navigation={navigation}
          component={SceneComponent}
        />
      </Screen>
    );
  };

  render() {
    const scenes = ScenesReducer(
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
