import warnOnce from 'warn-once';

export const FormSheet = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, FormSheet component is not supported for web.',
  );
  return null;
};
