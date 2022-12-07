export enum ScreenEdge {
  None = 0b0000,
  Top = 0b0001,
  Left = 0b0010,
  Bottom = 0b0100,
  Right = 0b1000,
  All = Top | Left | Bottom | Right,
}
