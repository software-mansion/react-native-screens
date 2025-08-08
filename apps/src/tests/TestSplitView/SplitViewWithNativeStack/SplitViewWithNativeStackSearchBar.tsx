import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';
import { ScrollViewWithText } from './common';
import Colors from '../../../shared/styling/Colors';

export const SplitViewWithNativeStackSearchBar = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitViewBaseConfig;
}) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerSearchBarOptions: {
              autoCapitalize: "words",
              autoFocus: true,
              barTintColor: Colors.GreenLight100,
              tintColor: Colors.RedDark100,
            }
          }}
        />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerSearchBarOptions: {
              hideNavigationBar: true
            }
          }}
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
              hideNavigationBar: false
            }
          }}
        />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
              hideWhenScrolling: false
            }
          }}
          CustomScreenTwo={ScrollViewWithText}
        />
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};
