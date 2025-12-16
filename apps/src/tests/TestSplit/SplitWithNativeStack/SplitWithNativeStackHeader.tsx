import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { Image, View } from 'react-native';
import Colors from '../../../shared/styling/Colors';
import { SplitBaseConfig } from '../helpers/types';

const HeaderLeft = () => (
  <View style={{ width: 36, height: 36, backgroundColor: Colors.RedDark100 }} />
);

const HeaderRight = () => (
  <View
    style={{ width: 36, height: 36, backgroundColor: Colors.GreenDark100 }}
  />
);

export const SplitWithNativeStackHeader = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitBaseConfig;
}) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{ headerShown: false }}
          customScreenTwoNavigationOptions={{
            headerShown: true,
            headerBackVisible: true,
            headerBackTitle: 'Custom back',
            headerBackTitleStyle: {
              fontSize: 14,
              fontFamily: 'Georgia',
            },
            headerTitleStyle: {
              color: 'blue',
              fontSize: 22,
              fontFamily: 'Georgia',
              fontWeight: 300,
            },
          }}
          customScreenThreeNavigationOptions={{
            headerShown: true,
            headerBackImageSource: require('../../../../assets/backButton.png'),
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{ headerTransparent: true }}
          customScreenTwoNavigationOptions={{
            headerTransparent: true,
            headerBlurEffect: 'systemMaterialDark',
          }}
          customScreenThreeNavigationOptions={{
            headerBackground: () => (
              <Image
                src="https://fastly.picsum.photos/id/483/400/200.jpg?hmac=wfMEmBoegvtws3gjbDFsepcn5zWMyq94Q3ZeKWRQn9I"
                width={400}
                height={200}
              />
            ),
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerTintColor: Colors.RedDark100,
            headerTitle: 'Custom header title',
          }}
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
              onCancelButtonPress: () => {
                console.log('cancel button press');
              },
            },
          }}
          customScreenThreeNavigationOptions={{
            headerLeft: HeaderLeft,
            headerRight: HeaderRight,
          }}
        />
      </Split.Column>
    </Split.Host>
  );
};
