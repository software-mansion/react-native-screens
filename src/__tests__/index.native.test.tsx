import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

describe('[ScreenContainer]', () => {
  it('renders a screen with content', () => {
    const text = 'Hello, world!';
    const scene = render(
      <ScreenContainer>
        <Screen>
          <Text>{text}</Text>
        </Screen>
      </ScreenContainer>
    );
    const textEl = scene.queryByText(text);
    expect(textEl).toHaveTextContent(text);
  });
});
