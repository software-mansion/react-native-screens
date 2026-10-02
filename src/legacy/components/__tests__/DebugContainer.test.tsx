import * as React from 'react';
import { Platform, RootTagContext, Text, type RootTag } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import DebugContainer from '../DebugContainer';

jest.mock('../ScreenContentWrapper', () => ({
  __esModule: true,
  default: jest.requireActual('react-native').View,
}));

function RootReading() {
  return <Text>{String(React.useContext(RootTagContext))}</Text>;
}

afterEach(() => jest.restoreAllMocks());

it.each(['ios', 'android'] as const)(
  'preserves the root tag inside a %s transparent modal',
  async platform => {
    jest.replaceProperty(Platform, 'OS', platform);
    let tree: ReactTestRenderer.ReactTestRenderer;

    await act(async () => {
      tree = ReactTestRenderer.create(
        <RootTagContext.Provider value={41 as unknown as RootTag}>
          <DebugContainer stackPresentation="transparentModal">
            <RootReading />
          </DebugContainer>
        </RootTagContext.Provider>,
      );
    });

    try {
      expect(tree!.root.findByType(Text).props.children).toBe('41');
    } finally {
      await act(async () => tree!.unmount());
    }
  },
);
