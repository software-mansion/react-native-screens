import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, SafeAreaView} from 'react-native';

import {MenuItem} from '../components';

interface Props {
  screens: Record<string, {title: string; component: () => JSX.Element}>;
}

export const MainScreen = ({screens}: Props): JSX.Element => {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <SafeAreaView>
        {(Object.keys(screens) as (keyof typeof screens)[]).map((name) => (
          <MenuItem
            key={name}
            title={screens[name].title}
            onPress={() => navigation.navigate(name)}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};
