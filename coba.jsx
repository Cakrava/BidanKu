import {createDrawerNavigator} from '@react-navigation/drawer';
import {View} from 'react-native';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );

  function Feed() {
    return <View></View>;
  }

  function Article() {
    return <View></View>;
  }
}
