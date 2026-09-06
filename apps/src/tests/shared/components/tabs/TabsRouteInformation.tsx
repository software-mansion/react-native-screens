import { useTabsNavigationContext } from '@apps/shared/containers/tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function TabsRouteInformation(props: { routeName?: string }) {
  const routeKey = useTabsNavigationContext().routeKey;

  return (
    <View>
      {props.routeName ? (
        <Text style={styles.routeInformation}>Name: {props.routeName}</Text>
      ) : null}
      <Text style={styles.routeInformation}>Key: {routeKey}</Text>
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
