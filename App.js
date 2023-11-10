import React,{useState,useRef,useEffect} from 'react';
import {View,Dimensions,ImageBackground} from 'react-native'
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator   } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite'
import Prefering from './screens/apploading';
import Login from './screens/login';
import Home from './screens/main';
import Drawerscreen from './screens/drawer';
import Monthscreen from './screens/monthscreen';
import Exam from './screens/exam';
import Examvoice from './screens/examvoice';
import Exam7 from './screens/exam7';
import Result from './screens/resultscreen';
import Result7 from './screens/resultscreen7';
import ResultVoice from './screens/resultscreenVoice';
import Profile from './screens/profile';
import Settings from './screens/settings';
import News from './screens/news';
import Barcode from './screens/barcode';
import Competition from './screens/competition';
import Aboutus from './screens/aboutus';
import * as Notifications from 'expo-notifications';
import Phone from './screens/phone';
import "react-native-gesture-handler";
import config from './config.json'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const db=SQLite.openDatabase(config.basename)
const Stack1 =createStackNavigator();

const NewsStackNav =  (navigation ) => {
  return (  
    <Stack1.Navigator screenOptions={{headerShown:false}} >     
       <Stack1.Screen  name="Competition" component={Competition}   options={({navigation})=>({ 
         headerShown:null     
        })}/>
        <Stack1.Screen name="News"  component={News}  options={({navigation})=>({ 
         headerShown:null     
        })}/>
    </Stack1.Navigator>
  );
}
const Stack = createStackNavigator();
const MainStackNavigator =  (navigation ) => {
  return (
    
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={'Main'} >     
       <Stack.Screen  name="Main" component={Home}   options={({navigation})=>({ 
         headerShown:null
      
        })}/>
       <Stack.Screen name="Barcode" component={Barcode}   options={({navigation})=>({ 
         headerShown:null
      
        })}/>
        <Stack.Screen name="Month"component={Monthscreen}  options={({navigation})=>({ 
         headerShown:null
      
        })}/>
        <Stack.Screen name="Exam"  component={Exam} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
         <Stack.Screen name="Examvoice"  component={Examvoice} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
         <Stack.Screen name="Exam7"  component={Exam7} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
         <Stack.Screen name="Result"  component={Result}  options={({navigation})=>({ 
         headerShown:null
      
        })}/>
        <Stack.Screen name="Result7"  component={Result7} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
        <Stack.Screen name="Resultvoice"  component={ResultVoice} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
         <Stack.Screen name="News"  component={NewsStackNav} options={({navigation})=>({ 
         headerShown:null
      
        })}/>
    </Stack.Navigator>
  );
}
const Drawer = createDrawerNavigator();

  //Notifications.addNotificationResponseReceivedListener((notif)=>{console.log('noruf iresn gadaa')});
 export default function App(props) {
  const [apploading, setApploading] = useState(true)
   useEffect(()=>{
       prepareSql() 
    },[])
  const prepareSql=async ()=>{
      await Font.loadAsync({
        'myfont': require('./assets/fonts/ROBOTO-REGULAR.ttf'),
      }) 
      db.transaction(async tx => {
        await execQuery(tx,'CREATE TABLE IF NOT EXISTS  medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);') 
        await execQuery(tx,'CREATE TABLE IF NOT EXISTS  D03(D0300 integer, D0301 text, D0302 text,D0303 text,D0304 text,D0305 text,D0306 text,D0307 integer);') 
        await execQuery(tx,'CREATE TABLE IF NOT EXISTS  companyinfo2(mail text,facebookurl text,address text,about text,trialtext text,phone text,date text);') 
        await execQuery(tx,'CREATE TABLE IF NOT EXISTS  dayscore2(date text,score integer,scorecolor text);') 
        setApploading(false)
      })
    }
  const execQuery=async (tx,query)=>{
    return new Promise(async resolve =>{
         tx.executeSql(
          'CREATE TABLE IF NOT EXISTS  medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);'
          ,[]
          ,(tx,res)=>{
              resolve()
            }
          ,(tx,res)=>{console.log(query)}     
          )
    })
  }
     
 
  if(apploading)
    return (
     <View>
        <ImageBackground source={require('./assets/modalimage.png')} style={{width:Dimensions.get('screen').width,height:Dimensions.get('screen').height+30}}/>
      </View>
    )
  else{console.log('returned')
      return (
            <NavigationContainer >
                <Drawer.Navigator   screenOptions={{headerShown:false}}  initialRouteName='Apploading'  drawerStyle={{backgroundColor:'#fff',width:Dimensions.get('window').width/1.6}}  drawerContent={(props) => <Drawerscreen {...props} />}  drawerType={Dimensions.width >= 768 ? 'permanent' : 'front'} >  
                    <Drawer.Screen options={{headerShown:false}} name="Apploading" initialParams={{id:0}} component={Prefering} />
                    <Drawer.Screen options={{headerShown:false}} name="Login"  component={Login} />
                    <Drawer.Screen options={{headerShown:false}} name="Home"  component={MainStackNavigator} />
                    <Drawer.Screen options={{headerShown:false}} name="Profile"  component={Profile} />
                    <Drawer.Screen options={{headerShown:false}} name="Settings"  component={Settings} />
                    <Drawer.Screen options={{headerShown:false}} name="Competition"  component={NewsStackNav} />
                    <Drawer.Screen options={{headerShown:false}} name="Aboutus"  component={Aboutus} />
                    <Drawer.Screen options={{headerShown:false}} name="Phone"  component={Phone} />
                </Drawer.Navigator>
            </NavigationContainer>
    
    
      )}
  }
  
 