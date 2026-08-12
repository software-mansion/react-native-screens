import * as React from 'react';
import { View, Text, Button } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

type ScreenKey = 'home' | 'detailWithBackTitle' | 'detailWithoutBackTitle';

type DetailRouteConfig = {
  title: string;
  backTitleVisible: boolean;
  backTitle: string;
  description: string;
};

const DETAIL_ROUTE_CONFIGS: Record<
  Exclude<ScreenKey, 'home'>,
  DetailRouteConfig
> = {
  detailWithBackTitle: {
    title: 'Detail with back title',
    backTitleVisible: true,
    backTitle: 'Hi',
    description: 'title',
  },
  detailWithoutBackTitle: {
    title: 'Detail without back title',
    backTitleVisible: false,
    backTitle: 'Hi',
    description: 'no title',
  },
};

export default function App() {
  const [pushedScreenKey, setPushedScreenKey] =
    React.useState<ScreenKey>('home');

  const popToHome = () => {
    setPushedScreenKey('home');
  };

  const detailRouteConfig =
    pushedScreenKey === 'home' ? null : DETAIL_ROUTE_CONFIGS[pushedScreenKey];

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key="home" activityState={2} isNativeStack>
        <ScreenStackHeaderConfig title="Home" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button
            title="Push with back title"
            onPress={() => setPushedScreenKey('detailWithBackTitle')}
          />
          <Button
            title="Push without back title"
            onPress={() => setPushedScreenKey('detailWithoutBackTitle')}
          />
        </View>
      </Screen>
      {detailRouteConfig != null && (
        <Screen
          key={pushedScreenKey}
          activityState={2}
          isNativeStack
          onDismissed={popToHome}>
          <ScreenStackHeaderConfig
            title={detailRouteConfig.title}
            backTitleVisible={detailRouteConfig.backTitleVisible}
            backTitle={detailRouteConfig.backTitle}
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>
              Back chevron should have {detailRouteConfig.description}
            </Text>
            <Button title="Pop" onPress={popToHome} />
          </View>
        </Screen>
      )}
    </ScreenStack>
  );
}
