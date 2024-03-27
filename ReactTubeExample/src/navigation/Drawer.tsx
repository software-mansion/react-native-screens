import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppStyle } from '../context/AppStyleContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackProp } from './types';

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function Drawer({ open, onOpen, onClose }: Props) {
  console.log('Open: ', open);

  useEffect(() => {
    openDrawer.value = open;
  }, [open]);

  const openDrawer = useSharedValue(open);

  const style = useAnimatedStyle(() => {
    return {
      height: '100%',
      width: withTiming(openDrawer.value ? 300 : 150),
    };
  });

  const navigation = useNavigation<NativeStackProp>();

  const navigationWrapper = useCallback(
    (fkt: () => void) => {
      return () => {
        onClose();
        fkt();
      };
    },
    [onClose]
  );

  return (
    <Animated.View style={[styles.container, style]}>
      <DrawerItem
        title={'Home'}
        onFocus={() => onOpen()}
        start
        onPress={navigationWrapper(() => navigation.navigate('HomeFeed'))}
      />
      <DrawerItem
        title={'Search'}
        onFocus={() => onOpen()}
        // tboba: .replace might work there!
        onPress={() => navigation.navigate('Search')}
      />
      <DrawerItem
        title={'Login'}
        onFocus={() => onOpen()}
        onPress={() => navigation.navigate('LoginScreen')}
      />
      <DrawerItem
        title={'Subscriptions'}
        onFocus={() => onOpen()}
        onPress={() => navigation.navigate('SubscriptionScreen')}
      />
      <DrawerItem
        title={'History'}
        onFocus={() => onOpen()}
        onPress={() => navigation.navigate('HistoryScreen')}
      />
      <DrawerItem
        title={'Library'}
        onFocus={() => onOpen()}
        onPress={() => navigation.navigate('LibraryScreen')}
      />
      <DrawerItem
        bottom
        title={'Settings'}
        onFocus={() => onOpen()}
        onPress={() => navigation.navigate('SettingsScreen')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
});

interface ItemProps {
  title: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  start?: boolean;
  bottom?: boolean;
}

const DrawerItem = forwardRef<TouchableOpacity, ItemProps>(
  ({ title, onFocus, onBlur, onPress, start, bottom }, ref) => {
    const { style } = useAppStyle();
    const [focus, setFocus] = useState(false);
    return (
      <TouchableOpacity
        style={[
          itemStyles.container,
          start || bottom
            ? { flex: 1, justifyContent: start ? 'flex-end' : 'flex-start' }
            : {},
        ]}
        onPress={onPress}
        onFocus={() => {
          setFocus(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocus(false);
          onBlur?.();
        }}>
        <Text
          style={[
            itemStyles.text,
            { color: style.textColor, opacity: focus ? 0.5 : 1 },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

const itemStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 0,
  },
  text: {
    fontSize: 15,
  },
});
