import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DataBidan from './DataBidan';
import TambahDataBidan from './TambahDataBidan';

const Stack = createNativeStackNavigator();

export default function NavBidan() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="TampilBidan">
        <Stack.Screen
          name="TampilBidan"
          component={DataBidan}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TambahDataBidan"
          component={TambahDataBidan}
          options={{
            headerTitle: 'Tambah Bidan',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
