import warnOnce from 'warn-once';

export const ContainedModalReplacingContent = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModalReplacingContent component is supported only for iOS.',
  );
  return null;
};
