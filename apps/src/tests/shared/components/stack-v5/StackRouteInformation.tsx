import React from 'react';
import { useStackNavigationContext } from '@apps/shared/gamma/containers/stack';
import { StyleSheet, Text, View } from 'react-native';

export function StackRouteInformation(props: { routeName?: string }) {
  const routeKey = useStackNavigationContext().routeKey;

  return (
    <View>
      {props.routeName ? (
        <Text style={styles.routeInformation} testID="stack-route-name">
          Name: {props.routeName}
        </Text>
      ) : null}
      <Text style={styles.routeInformation} testID="stack-route-key">
        Key: {routeKey}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
