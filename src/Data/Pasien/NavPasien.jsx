import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DataPasien from './DataPasien';

const Stack = createNativeStackNavigator();

export default function NavPasien() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="TampilPasien">
        <Stack.Screen
          name="TampilPasien"
          component={DataPasien}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
