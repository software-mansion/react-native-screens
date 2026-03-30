import React from 'react';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { Image, View } from 'react-native';
import Colors from '../../../../shared/styling/Colors';
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
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  return (
    <SplitView {...splitBaseConfig}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};
