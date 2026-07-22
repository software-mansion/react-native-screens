import warnOnce from 'warn-once';

export const ContainedModal = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModal component is supported only for iOS.',
  );
  return null;
};
