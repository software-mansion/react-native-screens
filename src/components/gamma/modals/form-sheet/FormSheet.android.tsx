import warnOnce from 'warn-once';

export const FormSheet = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, FormSheet component is supported only for iOS.',
  );
  return null;
};
