import type {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { computeProgress } from '../constraints';

jest.mock('react-native-reanimated', () => ({ ScreenTransition: {} }));
jest.mock('react-native-gesture-handler', () => ({ PointerType: {} }));

const screenDimensions = { width: 400, height: 1000 };

function panEvent(
  translationX: number,
  translationY: number,
): GestureUpdateEvent<PanGestureHandlerEventPayload> {
  return {
    translationX,
    translationY,
  } as GestureUpdateEvent<PanGestureHandlerEventPayload>;
}

describe('computeProgress', () => {
  it('grows from 0 to 1 when swiping right towards the right edge', () => {
    const start = { absoluteX: 100, absoluteY: 500 };

    expect(
      computeProgress('swipeRight', panEvent(150, 0), screenDimensions, start),
    ).toBeCloseTo(0.5);
    expect(
      computeProgress('swipeRight', panEvent(300, 0), screenDimensions, start),
    ).toBeCloseTo(1);
  });

  it('grows from 0 to 1 when swiping left towards the left edge', () => {
    const start = { absoluteX: 300, absoluteY: 500 };

    expect(
      computeProgress('swipeLeft', panEvent(-150, 0), screenDimensions, start),
    ).toBeCloseTo(0.5);
    expect(
      computeProgress('swipeLeft', panEvent(-300, 0), screenDimensions, start),
    ).toBeCloseTo(1);
  });

  it('grows from 0 to 1 when swiping down towards the bottom edge', () => {
    const start = { absoluteX: 200, absoluteY: 200 };

    expect(
      computeProgress('swipeDown', panEvent(0, 400), screenDimensions, start),
    ).toBeCloseTo(0.5);
    expect(
      computeProgress('swipeDown', panEvent(0, 800), screenDimensions, start),
    ).toBeCloseTo(1);
  });

  it('grows from 0 to 1 when swiping up towards the top edge', () => {
    const start = { absoluteX: 200, absoluteY: 800 };

    expect(
      computeProgress('swipeUp', panEvent(0, -400), screenDimensions, start),
    ).toBeCloseTo(0.5);
    expect(
      computeProgress('swipeUp', panEvent(0, -800), screenDimensions, start),
    ).toBeCloseTo(1);
  });
});
