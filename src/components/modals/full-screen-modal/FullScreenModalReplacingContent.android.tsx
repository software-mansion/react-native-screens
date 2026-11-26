import warnOnce from 'warn-once';

export const FullScreenModalReplacingContent = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, FullScreenModalReplacingContent component is supported only for iOS.',
  );
  return null;
};
