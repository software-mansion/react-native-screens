import { SearchBarProps } from 'react-native-screens';

export function isSearchBarAvailable(os: string) {
  return ['ios', 'android'].includes(os);
}

export function shouldShowSearchBar(
  os: string,
  searchBarProps: SearchBarProps | undefined
): searchBarProps is SearchBarProps {
  if (isSearchBarAvailable(os)) {
    const platforms: string[] = searchBarProps?.platforms ?? ['ios'];
    return platforms.includes(os);
  }
  return true;
}
