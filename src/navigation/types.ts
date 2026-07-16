import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  TitleDetail: { titleId: string };
  Player: { titleId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Downloads: undefined;
  Profile: undefined;
};
