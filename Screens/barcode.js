import { StatusBar } from 'expo-status-bar';
import React,{useState,useRef,useEffect} from 'react';
import { StyleSheet, Text, View,Platform,Alert,ImageBackground,ActivityIndicator, Dimensions} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-tiny-toast'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { isDevice } from 'expo-device';
import { post } from '../api/request';
const width=Dimensions.get('window').width
export default function Barcode({navigation,route}) {

  const [height, setHeight] = useState(width)
  const [textbarcode, setTextbarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [token,setExpoToken]=useState(null)
  useEffect(() => {
    (async () => {
      registerForPushNotificationsAsync().then(token => setExpoToken(token));
      setLoading(true)
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHeight((height-10))
      setTimeout(() => {
        setLoading(false)
     }, 500);
    })();
    return () => {
    
    };
  }, []);
  
  const navigatemonth=()=>{
      var date=dayjs()
      navigation.navigate('Month',{'month':date.month()+1,'year':date.year(),'day':date.date()})
  }
  return (
    
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={{width:'100%',height:Dimensions.get('window').height,justifyContent:"center"}} >
              <Text style={{color:'black',textAlign:'center',marginTop:20,paddingHorizontal:5}}>{'Идэвхжүүлэх код оруулна уу'}</Text>
        <View style={{flexDirection:'row',width:'70%',marginHorizontal:'15%',marginTop:10,alignItems:'center',justifyContent:'center'}}>
             <TextInput placeholder="Kод" maxLength={8} style={{borderRadius:20,borderWidth:1,height:30,width:'60%',paddingLeft:10,marginRight:10}} value={textbarcode} onChangeText={(e)=>setTextbarcode(e)}></TextInput>
               <TouchableOpacity onPress={login}  style={{width:100,borderRadius:20,borderWidth:1,height:30,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Илгээх'}</Text>
                </TouchableOpacity>
        </View>
      
        <TouchableOpacity onPress={navigatemonth}  style={{alignSelf:'center',width:height-100,borderRadius:20,marginTop:10,borderWidth:1,height:50,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Хаах'}</Text>
       </TouchableOpacity>
                </ImageBackground>
  );

   async function login(){
     if(textbarcode=="" || textbarcode.length!=8 )
     {
        Toast.show('Идэвхжүүлэх код оруулна уу !',{
          position: Toast.position.BOTTOM,
          containerStyle:{width:280,height:80,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
          textStyle: {flexWrap:'wrap'},
          imgStyle: {},
          mask: true,
          maskStyle:{},                   
       })
       return ;
    }
    var userId=await SecureStore.getItemAsync('userId');
    if(!userId) 
      Toast.show('Таны хэрэглэгчийн дугаар үүсээгүй байна дахин суулгана уу!',{
          position: Toast.position.BOTTOM,
          containerStyle:{width:280,height:80,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
          textStyle: {flexWrap:'wrap'},
          imgStyle: {},
          mask: true,
          maskStyle:{},                   
       })
    post('/user/verify',{userId:userId,expoToken:token,code:textbarcode}).then(async e=>{
        if(e && e.success)
        {
             var date=dayjs()
             Toast.show(`Баяр хүргье та амжиллтай сунгалаа ашиглах хугацаа ${date.add(1,'year').format('YYYY-MM-DD')} хүртэл. Амжилт хүсье 😉`,{
                position: Toast.position.BOTTOM,
                containerStyle:{width:280,height:80,justifyContent:'center',alignItems:'center',backgroundColor:'#3ae06f'},
                textStyle: {flexWrap:'wrap'},
                imgStyle: {},
                mask: true,
                duration:5000,
                maskStyle:{},                   
            })
            await SecureStore.setItemAsync('trailDate',date.endOf('year').format('YYYY-MM-DD'))
            await SecureStore.setItemAsync('code',textbarcode)
            navigation.navigate('Month',{'month':date.month()+1,'year':date.year(),'day':date.date()})
        }
    })

  }
   async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e8cdc831-6abd-4c09-ba8f-bff369aa39a5' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
  }
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    backgroundColor: '#dbdbdb',
    alignItems:'center'
  },
  header:{
     flexDirection:'row',
     justifyContent:'flex-start',
     width:'100%',
     height:60,
     borderBottomStartRadius:10,
     borderBottomEndRadius:10,
     borderWidth:0.3,
     alignItems:'center'
  }
});
