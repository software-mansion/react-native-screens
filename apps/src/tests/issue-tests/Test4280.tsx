import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const rtlScreenOptions = {
  headerLargeTitle: true,
  unstable_nativeProps: {
    headerConfig: {
      direction: 'rtl',
    },
  },
} as never;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={rtlScreenOptions}>
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'ملف الرفيق' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Profile() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <View style={styles.content}>
        <Text style={styles.referenceTitle}>ملف الرفيق</Text>
        <Text style={styles.description}>
          يجب أن يظهر العنوان الكبير والعنوان المرجعي في اتجاه صحيح.
        </Text>
      </View>
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
    textAlign: 'right',
  },
  description: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'right',
  },
});
