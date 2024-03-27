import {CompositeNavigationProp, RouteProp} from "@react-navigation/native";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "./RootStackNavigator";
import {RootDrawerParamList} from "./DrawerStackNavigator";

export type NativeStackProp = CompositeNavigationProp<
  DrawerNavigationProp<RootDrawerParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type RootRouteProp = RouteProp<RootStackParamList>;
