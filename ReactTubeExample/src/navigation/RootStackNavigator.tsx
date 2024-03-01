import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import VideoScreen from '../screens/VideoScreen';
import { Platform } from 'react-native';
import SearchScreen from '../screens/SearchScreen';
import HomeWrapperScreen from '../screens/HomeWrapperScreen';
import ChannelScreen from '../screens/ChannelScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { YTNodes } from '../utils/Youtube';
import LoadingScreen from '../screens/LoadlingScreen';
import useAppInit from '../hooks/general/useAppInit';
import VideoScreenWrapper from '../screens/phone/VideoScreenWrapper';

export type RootStackParamList = {
  LoadingScreen: undefined;
  Home: undefined;
  VideoScreen: {
    videoId: string;
    navEndpoint?: YTNodes.NavigationEndpoint;
    reel?: boolean;
  };
  ChannelScreen: { channelId: string };
  PlaylistScreen: { playlistId: string };
  Search: undefined;
  SubscriptionScreen: undefined;
  HistoryScreen: undefined;
  SettingsScreen: undefined;
  LoginScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { init } = useAppInit();

  return (
    <Stack.Navigator screenOptions={Platform.isTV ? { headerShown: true } : {}}>
      {!init ? (
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeWrapperScreen}
            options={!Platform.isTV ? { headerShown: false } : undefined}
          />
          <Stack.Screen
            name="VideoScreen"
            component={Platform.isTV ? VideoScreen : VideoScreenWrapper}
            options={{ title: 'Video' }}
          />
          <Stack.Screen
            name={'ChannelScreen'}
            component={ChannelScreen}
            options={{ title: 'Channel' }}
          />
          <Stack.Screen
            name={'PlaylistScreen'}
            component={PlaylistScreen}
            options={{ title: 'Playlist' }}
          />
          <Stack.Screen
            name={'Search'}
            component={SearchScreen}
            options={{
              // searchBar: {
              //   placeholder: "Search",
              //   hideWhenScrolling: false,
              // },
              searchBar: {
                placeholder: 'Suche',
                hideWhenScrolling: false,
              },
            }}
          />
          <Stack.Screen
            name={'SubscriptionScreen'}
            component={SubscriptionScreen}
          />
          <Stack.Screen name={'HistoryScreen'} component={HistoryScreen} />
          <Stack.Screen name={'SettingsScreen'} component={SettingsScreen} />
          <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
