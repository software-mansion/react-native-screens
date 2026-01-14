import React, { Fragment } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText, ThemedTextInput } from '../../shared';

type StackRouteParamList = {
  Home: undefined;
  FormSheet: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <View style={[{ backgroundColor: 'goldenrod', flex: 1 }]}>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
}

function FormSheet({}: StackNavigationProp) {
  const fields = [
    { name: 'form-first-name', placeholder: 'First Name *', autoFocus: true },
    { name: 'form-last-name', placeholder: 'Last Name *' },
    { name: 'form-email', placeholder: 'Email *' },
  ];

  return (
    <View testID="form" style={styles.wrapper}>
      <ThemedText testID="form-header" style={styles.heading}>
        Example form
      </ThemedText>
      {fields.map(({ name, placeholder, autoFocus }) => (
        <Fragment key={name}>
          <ThemedText testID={`${name}-label`} style={styles.label}>
            {placeholder}
          </ThemedText>
          <ThemedTextInput
            autoFocus={autoFocus}
            testID={`${name}-input`}
            style={styles.input}
          />
        </Fragment>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5, 0.85],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    height: 40,
  },
});
