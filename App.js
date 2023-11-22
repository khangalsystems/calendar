import React,{useState,useRef,useEffect} from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import "react-native-gesture-handler";
import { Provider} from 'react-redux';
import store from './store/store';
import CheckRoute from './screens/checkRoute';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function App() {
   useEffect(()=>{
       prepareSql() 
    },[])
    const prepareSql=async ()=>{
        await Font.loadAsync({
          'myfont': require('./assets/fonts/ROBOTO-REGULAR.ttf'),
        }) 
    }

    return <Provider store={store}>
                <NavigationContainer >
                    <CheckRoute/>
                </NavigationContainer>
            </Provider>
  }
  
 /// alias codes
 /// pass:calendar123 
 /// aliasame:smartcalendarAlias
 /// aliaspPass:smartAlias123