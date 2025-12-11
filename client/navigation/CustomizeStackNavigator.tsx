import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CustomizeScreen from "@/screens/CustomizeScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CustomizeStackParamList = {
  Customize: undefined;
};

const Stack = createNativeStackNavigator<CustomizeStackParamList>();

export default function CustomizeStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Customize"
        component={CustomizeScreen}
        options={{
          headerTitle: "Customize",
        }}
      />
    </Stack.Navigator>
  );
}
