export interface SAVExampleConfig {
  safeAreaTopEdge: boolean;
  safeAreaBottomEdge: boolean;
  safeAreaLeftEdge: boolean;
  safeAreaRightEdge: boolean;

  content:
    | 'regularView'
    | 'scrollViewNever'
    | 'scrollViewAutomatic'
    | 'tabs'
    | 'stack';
}
