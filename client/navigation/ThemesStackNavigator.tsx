import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ThemesScreen from "@/screens/ThemesScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type ThemesStackParamList = {
  Themes: undefined;
};

const Stack = createNativeStackNavigator<ThemesStackParamList>();

export default function ThemesStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Themes"
        component={ThemesScreen}
        options={{
          headerTitle: "Themes",
        }}
      />
    </Stack.Navigator>
  );
}
