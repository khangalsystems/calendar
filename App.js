import React,{useState,useRef,useEffect} from 'react';
import {View,Dimensions,ImageBackground} from 'react-native'
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite'
import Prefering from './Screens/apploading';
import Login from './Screens/login';
import Home from './Screens/main';
import Drawerscreen from './Screens/drawer';
import Monthscreen from './Screens/monthscreen';
import Exam from './Screens/exam';
import Examvoice from './Screens/examvoice';
import Exam7 from './Screens/exam7';
import Result from './Screens/resultscreen';
import Result7 from './Screens/resultscreen7';
import ResultVoice from './Screens/resultscreenVoice';
import Profile from './Screens/profile';
import Settings from './Screens/settings';
import News from './Screens/news';
import Barcode from './Screens/barcode';
import Competition from './Screens/competition';
import Aboutus from './Screens/aboutus';
import * as Notifications from 'expo-notifications';
import Phone from './Screens/phone';

import config from './config.json'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const db=SQLite.openDatabase(config.basename)

const SideStack = createStackNavigator();
const NewsStack = createStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const NewsStackNav =  (navigation ) => {
  return (  
    <NewsStack.Navigator initialRouteName={'Competition'} >     
       <Stack.Screen name="Competition" component={Competition}   options={({navigation})=>({ 
         headerShown:null     
        })}/>
        <Stack.Screen name="News"  component={News}  options={({navigation})=>({ 
         headerShown:null     
        })}/>
    </NewsStack.Navigator>
  );
}
const Stack = createStackNavigator();
const MainStackNavigator =  (navigation ) => {
  return (
    
    <Stack.Navigator initialRouteName={'Main'} >     
       <Stack.Screen name="Main" component={Home}   options={({navigation})=>({ 
         headerShown:null
      
        })}/>
       <Stack.Screen name="Barcode" component={Barcode}   options={({navigation})=>({ 
         headerShown:null
      
        })}/>
        <Stack.Screen name="Month"  component={Monthscreen}  options={({navigation})=>({ 
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
const DrawerStack =  (props ) => {
  
  return (   
    <Drawer.Navigator  initialRouteName='Apploading'  drawerStyle={{backgroundColor:'#fff',width:Dimensions.get('window').width/1.6}}  drawerContent={(props) => <Drawerscreen {...props} />}  drawerType={Dimensions.width >= 768 ? 'permanent' : 'front'} >  
        <Drawer.Screen name="Apploading" initialParams={props.route.params} component={Prefering} />
        <Drawer.Screen name="Login"  component={Login} />
        <Drawer.Screen name="Home"  component={MainStackNavigator} />
        <Drawer.Screen name="Profile"  component={Profile} />
        <Drawer.Screen name="Settings"  component={Settings} />
        <Drawer.Screen name="Competition"  component={NewsStackNav} />
        <Drawer.Screen name="Aboutus"  component={Aboutus} />
        <Drawer.Screen name="phone"  component={Phone} />
    </Drawer.Navigator>
  );
}
  Notifications.addNotificationResponseReceivedListener((notif)=>{console.log('noruf iresn gadaa')});
 export default function App(props) {
  const [apploading, setApploading] = useState(true)
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [data,setData]=useState({screen:'Main',id:0})
  Notifications.addNotificationResponseReceivedListener((notif)=>{console.log('noruf iresn1'),setData(notif.notification.request.content.data)});

  useEffect(()=>{
    async function getper()
      {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log(status)
        if(status=='denied')
          await Permissions.askAsync(Permissions.NOTIFICATIONS);
      }
   
     getper()

    
      
    responseListener.current=Notifications.addNotificationResponseReceivedListener((notif)=>{console.log('noruf iresn2'),setData(notif.notification.request.content.data)});
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data
    ) {
      console.log('last notf')
      console.log(lastNotificationResponse.notification.request.content.data)
      setData(lastNotificationResponse.notification.request.content.data)
    }
    let myPromise = new Promise(async function(myResolve, myReject) {
      await Font.loadAsync({
        'myfont': require('./assets/fonts/ROBOTO-REGULAR.ttf'),
      }) 
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS  medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);'
          ,[]
          ,(tx,res)=>{
              
  /////////////////////////////////////
            db.transaction(tx => {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS  D03(D0300 integer, D0301 text, D0302 text,D0303 text,D0304 text,D0305 text,D0306 text,D0307 integer);'
               ,[],(tx,res)=>{
                    db.transaction(tx => {
                      tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS  companyinfo2(mail text,facebookurl text,address text,about text,trialtext text,phone text,date text);'
                        ,[]
                        ,(tx,res)=>{
                           myResolve(true)
                          }
                        ,(tx,res)=>{console.log(res)}
                              )
                        }
                        ) 
   
                  })
                  },(err)=>console.log('apjs err:'+err),(err)=>console.log('apjs err:'+err))
  
  ////////////////////////////////
            }
          ,(tx,res)=>{console.log(res)}
          )
           },(err)=>console.log('apjs err:'+err),(err)=>console.log('apjs err:'+err)
           )   
     
     db.transaction(tx => {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS  dayscore2(date text,score integer,scorecolor text);'
            ,[],(tx,res)=>{          
            })
      })  
      
     
              
              
      })
    myPromise.then((e)=>{

    
        setTimeout(() => {
          setApploading(false)
        }, 3000)    
     })
    }
  ,[lastNotificationResponse])
  
  if(apploading)
    return (
     <View>
        <ImageBackground source={require('./assets/modalimage.png')} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height+30}}/>
         
      </View>
    )
  else
  return (
  
         <NavigationContainer>
            <SideStack.Navigator initialRouteName={'Apploading'}>
              {/* <SideStack.Screen name="Apploading"  component={Prefering} />
              <SideStack.Screen name="Login"  component={Login} 
              options={{
                headerShown:null
              }}
              />
              <SideStack.Screen name="Loginbarcode"  component={Loginbarcode} 
              options={{
                headerShown:null
              }}
              /> */}
              <SideStack.Screen name="Drawer" initialParams={data}  component={DrawerStack} 
              options={{
                headerShown:null
              }}
               />
            </SideStack.Navigator>
        </NavigationContainer>
 
 
  );
  async function loadResourcesAsync() {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS  medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);'
        ,[]
        ,(tx,res)=>{
            
/////////////////////////////////////
          db.transaction(tx => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS  D03(D0300 integer, D0301 text, D0302 text,D0303 text,D0304 text,D0305 text,D0306 text,D0307 integer);'
             ,[],(tx,res)=>{
                 setApploading(false)
                })
                },(err)=>console.log('apjs err:'+err),(err)=>console.log('apjs err:'+err))

////////////////////////////////
          }
        ,(tx,res)=>{}
        )
         },(err)=>console.log('apjs err:'+err),(err)=>console.log('apjs err:'+err)
         )   
   
   db.transaction(tx => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS  dayscore2(date text,score integer,scorecolor text);'
          ,[],(tx,res)=>{          
          })
    })  
    
    db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS  companyinfo(mail text,facebookurl text,address text,about text,phone text,date text);'
            ,[]
            ,(tx,res)=>{
                 
              }
            ,(tx,res)=>{console.log(res)}
                  )
             }
             ) 
             await Font.loadAsync({
              'myfont': require('./assets/fonts/ROBOTO-REGULAR.ttf'),
            }) 
            
    }
  }
  
  
    function handleLoadingError(error) {
      console.log(error)
    }

    function handleFinishLoading(setApploading) {
      setApploading(false);
    }