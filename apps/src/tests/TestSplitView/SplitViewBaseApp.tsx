import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  PlatformColor,
} from 'react-native';
import { DummyComponent } from 'react-native-screens';
import { SafeAreaView, SplitViewHost, SplitViewScreen } from 'react-native-screens/experimental';

const mockData = ['email', 'github', 'bank', 'socialMedia'];

function PasswordElement({
  title,
  isActive,
  onPress,
}: {
  title: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: isActive ? PlatformColor('systemRed') : '#ffffff00',
        height: 200,
      }}>
      <DummyComponent>
        <Text style={{ color: isActive ? 'white' : 'black', fontSize: 16 }}>{title}</Text>
      </DummyComponent>
    </Pressable>
  );
}

function PasswordListView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePress = (item: string) => {
    setSelectedId(item);
  };

  return (
    <View style={{paddingVertical: 100, height: 100, flex: 1}}>
      {mockData.map((item) => (
        <PasswordElement
          key={item}
          title={item}
          isActive={selectedId === item}
          onPress={() => handlePress(item)}
        />
      ))}
    </View>
  );
}

const SplitViewBaseApp = () => {
  return (
    <SplitViewHost preferredDisplayMode='oneBesideSecondary' preferredSplitBehavior='tile'>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: '#ffffff00' }]}>
          <Text style={styles.text}>Primary column</Text>
        </View>
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={styles.wrapper}>
          <PasswordListView />
        </View>
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
  button: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplitViewBaseApp;
