import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBidan from './Data/Bidan/NavBidan';
import NavPasien from './Data/Pasien/NavPasien';
import NavObat from './Data/Obat/NavObat';
import LoginScreen from './Login/Login';
import Index from './Index';

//Import Screens

const stack = createNativeStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    //Periksa Token saat aplikasi dimuat
    const checkTokenUser = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      setUserToken(userToken);
    };
    checkTokenUser();
  }, []);
  const handleSetUserToken = token => {
    setUserToken(token);
  };

  return (
    <NavigationContainer>
      <stack.Navigator>
        {userToken == null ? (
          <stack.Screen name="Login" options={{headerShown: false}}>
            {props => (
              <LoginScreen {...props} setUserToken={handleSetUserToken} />
            )}
          </stack.Screen>
        ) : (
          <>
            <stack.Screen name="Index" options={{headerShown: false}}>
              {props => <Index {...props} setUserToken={setUserToken} />}
            </stack.Screen>
            <stack.Screen
              name="Bidan"
              component={NavBidan}
              options={{headerShown: false}}
            />
            <stack.Screen
              name="Pasien"
              component={NavPasien}
              options={{headerShown: false}}
            />
            <stack.Screen
              name="Obat"
              component={NavObat}
              options={{headerShown: false}}
            />
          </>
        )}
      </stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
