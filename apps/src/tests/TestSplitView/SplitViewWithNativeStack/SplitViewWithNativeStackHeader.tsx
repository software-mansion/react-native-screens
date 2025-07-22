import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { NativeStackNavigatorComponent } from '../helpers';
import { Image, View } from 'react-native';
import Colors from '../../../shared/styling/Colors';
import { SplitViewBaseConfig } from '../helpers/types';

const HeaderLeft = () => (
  <View style={{ width: 36, height: 36, backgroundColor: Colors.RedDark100 }} />
)

const HeaderRight = () => (
  <View style={{ width: 36, height: 36, backgroundColor: Colors.GreenDark100 }} />
)

export const SplitViewWithNativeStackHeader = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
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
            headerBackImageSource: require('../../../../assets/backButton.png')
          }}
        />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{ headerTransparent: true }}
          customScreenTwoNavigationOptions={{
            headerTransparent: true,
            headerBlurEffect: 'systemMaterialDark'
          }}
          customScreenThreeNavigationOptions={{
            headerBackground: () => (
              <Image src='https://fastly.picsum.photos/id/483/400/200.jpg?hmac=wfMEmBoegvtws3gjbDFsepcn5zWMyq94Q3ZeKWRQn9I' width={400} height={200} />
            ),
          }}
        />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{ headerTintColor: Colors.RedDark100, headerTitle: "Custom header title" }}
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
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
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
}
