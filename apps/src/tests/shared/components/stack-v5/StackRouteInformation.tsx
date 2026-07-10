import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Test-owned, session-global counter. It is incremented exactly once per
// mounted screen instance so scenarios can tell a *preserved* screen (stable
// id) apart from a *recreated* one (new, higher id) — without depending on the
// library's internal `routeKey` format (`r-<name>-<n>`), which is an
// implementation detail that may change without notice.
let instanceCounter = 0;

export function StackRouteInformation(props: { routeName?: string }) {
  // The useState initializer runs exactly once per mounted instance: it
  // survives re-renders and resets only when the screen is remounted.
  const [instanceId] = React.useState(() => ++instanceCounter);

  return (
    <View>
      {props.routeName ? (
        <Text style={styles.routeInformation}>Name: {props.routeName}</Text>
      ) : null}
      <Text style={styles.routeInformation}>Instance: {instanceId}</Text>
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
