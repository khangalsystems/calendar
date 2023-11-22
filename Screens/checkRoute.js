import { useDispatch, useSelector } from "react-redux"
import { getLogged } from "../store/selector"
import { createStackNavigator   } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './login';
import Home from './main';
import Drawerscreen from './drawer';
import Monthscreen from './monthscreen';
import Exam from './exam';
import Examvoice from './examvoice';
import Exam7 from './exam7';
import Result from './resultscreen';
import Result7 from './resultscreen7';
import ResultVoice from './resultscreenVoice';
import Profile from './profile';
import Settings from './settings';
import News from './news';
import Barcode from './barcode';
import Competition from './competition';
import Aboutus from './aboutus';
import Phone from './phone';
import { useEffect, useState } from "react";
import config from '../config.json'
import { setLogged } from "../store/reducer";
import * as SQLite from 'expo-sqlite'
import { Dimensions, View } from "react-native";
import { ImageBackground } from "react-native";
import { execQuery } from "../functions/execQuery";
import * as SecureStore from 'expo-secure-store'
import dayjs from "dayjs";
const Stack1 =createStackNavigator();
const loginStack =createStackNavigator();
const db=SQLite.openDatabase(config.basename)

const NewsStackNav =  (navigation ) => {
  return (  
    <Stack1.Navigator screenOptions={{headerShown:false}} >     
       <Stack1.Screen  name="AllNews" component={Competition}   options={({navigation})=>({ 
         headerShown:null     
        })}/>
        <Stack1.Screen name="OneNews"  component={News}  options={({navigation})=>({ 
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

const CheckRoute=()=>{
    const logged=useSelector(state=>state.data.logged)
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        getData()
    },[])
    const getData=async ()=>{
         db.transaction(async tx => {
                execQuery(tx,'CREATE TABLE IF NOT EXISTS  medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);')
                execQuery(tx,'CREATE TABLE IF NOT EXISTS  word(id integer,eng text, mon text,class text,date text,audio text);')
                execQuery(tx,'CREATE TABLE IF NOT EXISTS  companyinfo2(mail text,facebookurl text,address text,about text,trialtext text,phone text,date text);')
                execQuery(tx,'CREATE TABLE IF NOT EXISTS  dayscore2(date text,score integer,scorecolor text,year integer,month integer,day integer);')
                execQuery(tx,'CREATE TABLE IF NOT EXISTS  info(token text,phone text,name text,notifTime text,notifTime2 text,endDay text);')
                                 const userId=await SecureStore.getItemAsync('userId');
                                 const trailDate=await SecureStore.getItemAsync('trailDate');
                                 var expired=false
                                 if(trailDate) 
                                 {
                                  expired=dayjs(trailDate).year()!=dayjs().year()
                                 }
                                 if(userId && !expired)  dispatch(setLogged(true))
                                 else  dispatch(setLogged(false))
                                  console.log(userId)
                                  setLoading(false)
        })
    }
    if(loading)
        return  <ImageBackground source={require('../assets/modalimage.png')}/>
               
    else
     if(!logged)
            return    <loginStack.Navigator screenOptions={{headerShown:false}} >     
                              <loginStack.Screen  name="Login" component={Login}   options={({navigation})=>({ 
                                headerShown:null     
                                })}/>
                        </loginStack.Navigator>
     else return      <Drawer.Navigator   screenOptions={{headerShown:false}}  initialRouteName={'Home'}  drawerStyle={{backgroundColor:'#fff',width:Dimensions.get('window').width/1.6}}  drawerContent={(props) => <Drawerscreen {...props} />}  drawerType={Dimensions.width >= 768 ? 'permanent' : 'front'} >  
                            <Drawer.Screen options={{headerShown:false}} name="Home" initialParams={{id:0}} component={MainStackNavigator} />
                            <Drawer.Screen options={{headerShown:false}} name="Profile"  component={Profile} />
                            <Drawer.Screen options={{headerShown:false}} name="Settings"  component={Settings} />
                            <Drawer.Screen options={{headerShown:false}} name="News"  component={NewsStackNav} />
                            <Drawer.Screen options={{headerShown:false}} name="Aboutus"  component={Aboutus} />
                            <Drawer.Screen options={{headerShown:false}} name="Phone"  component={Phone} />
                        </Drawer.Navigator>
}

export default CheckRoute