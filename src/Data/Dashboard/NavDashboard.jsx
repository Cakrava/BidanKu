import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DataDashboard from './Dashboard';

const Stack = createNativeStackNavigator();

export default function NavDashboard() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="TampilDashboard">
        <Stack.Screen
          name="TampilDashboard"
          component={DataDashboard}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
