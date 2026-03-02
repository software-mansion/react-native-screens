import Colors from '../styling/Colors';

let GLOBAL_NEXT_COLOR_ID = 0;

export function generateNextColor() {
  const colors = [
    Colors.BlueDark100,
    Colors.GreenDark100,
    Colors.RedDark100,
    Colors.YellowDark100,
    Colors.PurpleDark100,
    Colors.BlueLight100,
    Colors.GreenLight100,
    Colors.RedLight100,
    Colors.YellowLight100,
    Colors.PurpleLight100,
  ];
  const index = GLOBAL_NEXT_COLOR_ID;
  GLOBAL_NEXT_COLOR_ID += 1;
  return colors[index % colors.length];
}
