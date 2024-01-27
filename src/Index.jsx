import React from 'react';
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import DesainDrawer from './Component/DesainDrawer';
import col from './assets/ColorHunt';
import NavBidan from './Data/Bidan/NavBidan';
import NavPasien from './Data/Pasien/NavPasien';
import NavObat from './Data/Obat/NavObat';
import NavDashboard from './Data/Dashboard/NavDashboard';

import Icon from 'react-native-vector-icons/Ionicons';
const Drawer = createDrawerNavigator();
const LaporanDrawer = createDrawerNavigator();

export default function Index(props) {
  const {setUserToken} = props;
  return (
    // <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={props => <DesainDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: col.merahgelap,
        drawerInactiveTintColor: col.hitam,
        drawerLabelStyle: {
          fontWeight: 'bold',
        },
        gestureEnabled: true, // Memastikan gesture swipe untuk membuka drawer diaktifkan
        edgeWidth: 50,
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={NavDashboard}
        options={{
          headerShown: true,
          drawerActiveTintColor: col.merahgelap,
          title: 'Dahsboard',
          marginLeft: -25,
          drawerIcon: ({focused, size}) => (
            <Icon
              name="home-outline"
              size={20}
              color={focused ? col.merahgelap : col.hitam}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="DataBidan"
        component={NavBidan}
        options={{
          headerShown: false,
          drawerActiveTintColor: col.merahgelap,
          title: 'Bidan',
          marginLeft: -25,
          drawerIcon: ({focused, size}) => (
            <Icon
              name="people-outline"
              size={20}
              color={focused ? col.merahgelap : col.hitam}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Pasien"
        component={NavPasien}
        options={{
          drawerActiveTintColor: col.merahgelap,
          title: 'Pasien',
          marginLeft: -25,
          drawerIcon: ({focused, size}) => (
            <Icon
              name="people-outline"
              size={20}
              color={focused ? col.merahgelap : col.hitam}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Obat"
        component={NavObat}
        options={{
          drawerActiveTintColor: col.merahgelap,
          title: 'Obat',
          marginLeft: -25,
          drawerIcon: ({focused, size}) => (
            <Icon
              name="medkit-outline"
              size={20}
              color={focused ? col.merahgelap : col.hitam}
            />
          ),
        }}
      />
    </Drawer.Navigator>
    // </NavigationContainer>
  );
}
