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
import { ScenesReducer, HeaderBackButton } from 'react-navigation-stack';
import {
  ScreenStack,
  Screen,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderTitleView,
} from 'react-native-screens';

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

  _renderHeaderConfig = scene => {
    const { navigationConfig } = this.props;
    const { options } = scene.descriptor;
    const { headerMode } = navigationConfig;

    const {
      title,
      titleFontFamily,
      titleFontSize,
      headerBackTitle,
      headerBackTitleFontFamily,
      headerBackTitleFontSize,
      headerTintColor,
      gestureEnabled,
      largeTitle,
      translucent,
    } = options;

    const headerOptions = {
      translucent: translucent === undefined ? false : translucent,
      title,
      titleFontFamily,
      titleFontSize,
      backTitle: headerBackTitle,
      backTitleFontFamily: headerBackTitleFontFamily,
      backTitleFontSize: headerBackTitleFontSize,
      color: headerTintColor,
      gestureEnabled: gestureEnabled === undefined ? true : gestureEnabled,
      largeTitle,
    };

    const hasHeader = headerMode !== 'none' && options.header !== null;
    if (!hasHeader) {
      return <ScreenStackHeaderConfig {...headerOptions} hidden />;
    }

    if (options.headerStyle !== undefined) {
      headerOptions.backgroundColor = options.headerStyle.backgroundColor;
    }

    const children = [];

    if (options.headerLeft !== undefined) {
      children.push(
        <ScreenStackHeaderLeftView>
          {options.headerLeft({ scene })}
        </ScreenStackHeaderLeftView>
      );
    } else if (options.headerBackImage !== undefined) {
      const goBack = () => {
        // Go back on next tick because button ripple effect needs to happen on Android
        requestAnimationFrame(() => {
          scene.descriptor.navigation.goBack(scene.descriptor.key);
        });
      };

      children.push(
        <ScreenStackHeaderLeftView>
          <HeaderBackButton
            onPress={goBack}
            pressColorAndroid={options.headerPressColorAndroid}
            tintColor={options.headerTintColor}
            backImage={options.headerBackImage}
            title={options.backButtonTitle}
            truncatedTitle={options.truncatedBackButtonTitle}
            backTitleVisible={this.props.backTitleVisible}
            titleStyle={options.headerBackTitleStyle}
            layoutPreset={this.props.layoutPreset}
            scene={scene}
          />
        </ScreenStackHeaderLeftView>
      );
    }

    if (options.headerTitle) {
      children.push(
        <ScreenStackHeaderTitleView>
          {options.headerTitle({ scene })}
        </ScreenStackHeaderTitleView>
      );
    }

    if (options.headerRight) {
      children.push(
        <ScreenStackHeaderRightView>
          {options.headerRight({ scene })}
        </ScreenStackHeaderRightView>
      );
    }

    if (children.length > 0) {
      headerOptions.children = children;
    }

    return <ScreenStackHeaderConfig {...headerOptions} />;
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
        style={{
          ...StyleSheet.absoluteFillObject,
          borderColor: 'green',
          borderWidth: 5,
        }}
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
