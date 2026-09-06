import * as React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

type StackParamList = {
  Profile: undefined;
  Details: undefined;
};

type ProfileProps = NativeStackScreenProps<StackParamList, 'Profile'>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const [isRTL, setIsRTL] = React.useState(true);
  const [hasLargeTitle, setHasLargeTitle] = React.useState(true);
  const [usesAlternateTitle, setUsesAlternateTitle] = React.useState(false);
  const title = usesAlternateTitle ? 'الملف البديل' : 'ملف الرفيق';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerLargeTitle: hasLargeTitle,
          unstable_nativeProps: {
            headerConfig: {
              direction: isRTL ? 'rtl' : 'ltr',
            },
          },
        }}>
        <Stack.Screen name="Profile" options={{ title }}>
          {props => (
            <Profile
              {...props}
              hasLargeTitle={hasLargeTitle}
              isRTL={isRTL}
              setHasLargeTitle={setHasLargeTitle}
              setIsRTL={setIsRTL}
              setUsesAlternateTitle={setUsesAlternateTitle}
              title={title}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" options={{ title: 'تفاصيل الملف' }}>
          {props => <Details {...props} isRTL={isRTL} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type ProfileTestProps = ProfileProps & {
  hasLargeTitle: boolean;
  isRTL: boolean;
  setHasLargeTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRTL: React.Dispatch<React.SetStateAction<boolean>>;
  setUsesAlternateTitle: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

function Profile({
  hasLargeTitle,
  isRTL,
  navigation,
  setHasLargeTitle,
  setIsRTL,
  setUsesAlternateTitle,
  title,
}: ProfileTestProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.scrollView, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <View style={[styles.content, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <Text testID="duplicate-react-title" style={styles.referenceTitle}>
          {title}
        </Text>
        <Text style={styles.description}>
          Duplicate React content. It must never receive a second transform.
        </Text>
        <Text style={styles.testState}>
          {isRTL ? 'RTL' : 'LTR'} · large title {hasLargeTitle ? 'on' : 'off'}
        </Text>
        <Button
          title="Change title"
          onPress={() => setUsesAlternateTitle(value => !value)}
        />
        <Button
          title="Toggle large title"
          onPress={() => setHasLargeTitle(value => !value)}
        />
        <Button
          title="Toggle direction"
          onPress={() => setIsRTL(value => !value)}
        />
        <Button
          title="Push details"
          onPress={() => navigation.push('Details')}
        />
        <View style={styles.longContent} />
      </View>
    </ScrollView>
  );
}

function Details({
  isRTL,
  navigation,
}: NativeStackScreenProps<StackParamList, 'Details'> & { isRTL: boolean }) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Button title="Pop profile" onPress={() => navigation.pop()} />
      <View style={styles.longContent} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    direction: 'rtl',
  },
  content: {
    direction: 'rtl',
    padding: 24,
  },
  referenceTitle: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'start',
  },
  description: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'right',
  },
  testState: {
    marginVertical: 16,
    textAlign: 'center',
  },
  longContent: {
    height: 1200,
  },
});
