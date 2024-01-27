import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DataObat from './DataObat';

const Stack = createNativeStackNavigator();

export default function NavObat() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="TampilObat">
        <Stack.Screen
          name="TampilObat"
          component={DataObat}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
