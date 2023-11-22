import React,{useState,useRef,useEffect} from 'react';
import { StyleSheet, Text, View,Switch,Animated,ImageBackground,ActivityIndicator, Dimensions} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite'
import Header from '../components/header'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-tiny-toast'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
import config from '../config.json'
import { downloadWords } from '../functions/downloadWords';
import dayjs from 'dayjs';
import { downloadNews } from '../functions/downloadNews';
const db=SQLite.openDatabase(config.basename)
export default function Settings({route,navigation}) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
   getnotinfo()
  }, []);

  const [on, setOn] = useState(true)
  const [donwloading, setDownloading] = useState(false)
  const [hour, setHour] = useState('0')
  const [minute, setMinute] = useState('0')
  const [hour2, setHour2] = useState('0')
  const [minute2, setMinute2] = useState('0')
  const [showdate1, setShowdate1] = useState(false)
  const [showdate2, setShowdate2] = useState(false)

  

 async function getnotinfo(){
    var notif1=await SecureStore.getItemAsync('notif1');
    var notif2=await SecureStore.getItemAsync('notif2');
    var takeNotif=await SecureStore.getItemAsync('takeNotif');
    setOn(takeNotif==='1')
    setHour(String(notif1).split(':')[0])
    setMinute(String(notif1).split(':')[1])
    setHour2(String(notif2).split(':')[0])
    setMinute2(String(notif2).split(':')[1])
  }
  const update=async ()=>{  
     setDownloading(true)
     //const res=await downloadWords()
     const res3=await downloadNews()
     setDownloading(false)
  }
  const changeTakeNotif=(e)=>{
    if(!e)
    {
      Notifications.cancelAllScheduledNotificationsAsync()
    }
    setOn(e)
  }
  const setNotif=async ()=>{
    Notifications.setNotificationChannelAsync('new-emails', {
      name: 'E-mail notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'email-sound.wav', // <- for Android 8.0+, see channelId property below
    });
     Notifications.cancelAllScheduledNotificationsAsync()
      Notifications.scheduleNotificationAsync({
         content:await getcontent(),
         trigger: {
           hour:parseInt(hour),minute:parseInt(minute), repeats: true 
        },
      });
       Notifications.scheduleNotificationAsync({
         content:await getcontent(),
         trigger: {
            hour:parseInt(hour2),minute:parseInt(minute2), repeats: true 
        },
      });
     
      Toast.show('Амжилттай хадгалагдлаа',{
        position: Toast.position.BOTTOM,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
        textStyle: {},
        imgStyle: {},
        mask: true,
        maskStyle:{},
    
      })
 
  }
  const changeTime1=(e)=>{
    setHour(e.getHours().toString())
    setMinute(e.getMinutes().toString())
    setShowdate1(false)
  }
  const changeTime2=(e)=>{
    setHour2(e.getHours().toString())
    setMinute2(e.getMinutes().toString())
    setShowdate2(false)
  }
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={styles.container}> 
      <Header navigation={navigation} url={""} params={{}}  title={'Тохиргоо'}/>
         

     <View style={{flexDirection:'row',paddingHorizontal:10,height:70,borderTopLeftRadius:20,borderTopRightRadius:20,marginTop:10, width:'100%',borderBottomWidth:0.3,backgroundColor:"#fff",borderBottomColor:'#4dd8f7',justifyContent:'space-between',alignItems:'center'}}> 
              <Text style={{width:'70%'}}>{'Цээжлэх үгийн мэдэгдэл хүлээн авах'}</Text>             
                <Switch
                  trackColor={{ false: "#767577", true: "#4dd8f7" }}
                  thumbColor={on ? "#6aa8e6" : "#f4f3f4"}
                  ios_backgroundColor="#6aa8e6"
                  onValueChange={changeTakeNotif}
                  value={on}
                />
     </View>
     {on?
     <View style={{flexDirection:'column',borderBottomWidth:0.3,backgroundColor:"#fff",height:140,alignItems:'center'}}>
      <View style={{flexDirection:'row',paddingHorizontal:10,height:89,width:'100%',borderBottomColor:'#4dd8f7',justifyContent:'space-between',alignItems:'center'}}> 
                <Text style={{color:on?'black':'grey',width:'55%'}}>{'Мэдэгдэл хүлээн авах цаг тохируулах'}</Text>   
                <View style={{flexDirection:'column',width:'45%'}} >          
                      <TouchableOpacity onPress={()=>{setShowdate1(!showdate1)}} style={{flexDirection:'row',borderWidth:1,borderRadius:5,alignItems:'center',width:'100%',justifyContent:'center'}}>
                          <TextInput
                              style={{ height: 30,marginBottom:5,borderColor:on?'black':'grey', borderBottomWidth: 1,textAlign:'center' }}
                              onChangeText={text => {setHour(text)}}
                              keyboardType={'number-pad'}
                              keyboardAppearance={'dark'}
                              editable={false}
                              value={hour}
                            />
                            <Text style={{marginHorizontal:5,color:on?'black':'grey'}}>{'цаг'}</Text>
                            <TextInput
                              style={{ height: 30,marginBottom:5,marginHorizontal:5,borderColor:on?'black':'grey', borderBottomWidth: 1 }}
                              onChangeText={text => {setMinute(text)}}
                              keyboardType={'number-pad'}
                              keyboardAppearance={'dark'}
                              editable={false}
                              value={minute}
                            />
                            <Text style={{marginHorizontal:5,color:on?'black':'grey'}}>{'минут'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>setShowdate2(!showdate2)} style={{flexDirection:'row',borderWidth:1,borderRadius:5,marginTop:5,alignItems:'center',width:'100%',justifyContent:'center'}}>
                          <TextInput
                              style={{ height: 30,marginBottom:5, borderColor:on?'black':'grey', borderBottomWidth: 1,textAlign:'center' }}
                              onChangeText={text => {setHour2(text)}}
                              keyboardType={'number-pad'}
                              keyboardAppearance={'dark'}
                              editable={false}
                              value={hour2}
                            />
                            <Text style={{marginHorizontal:5,color:on?'black':'grey'}}>{'цаг'}</Text>
                            <TextInput
                              style={{ height: 30,marginBottom:5,marginHorizontal:5,borderColor:on?'black':'grey', borderBottomWidth: 1 }}
                              onChangeText={text => {setMinute2(text)}}
                              keyboardType={'number-pad'}
                              keyboardAppearance={'dark'}
                              editable={false}
                              value={minute2}
                            />
                            <Text style={{marginHorizontal:5,color:on?'black':'grey'}}>{'минут'}</Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                          isVisible={showdate1}
                          mode='time'
                          is24Hour={true}
                          date={new Date(dayjs().set('hour',hour).set('minute',minute).format('YYYY-MM-DD HH:mm'))}
                          onConfirm={changeTime1}
                          onCancel={()=>setShowdate1(false)}
                        />
                      <DateTimePickerModal
                          isVisible={showdate2}
                          mode='time'
                          is24Hour={true}
                          date={new Date(dayjs().set('hour',hour2).set('minute',minute2).format('YYYY-MM-DD HH:mm'))}
                          onConfirm={changeTime2}
                          onCancel={()=>setShowdate2(false)}
                        />
                </View>
                
      </View>
      <TouchableOpacity onPress={setNotif} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7',height:40,width:100,marginTop:5,borderRadius:10,marginBottom:5}}>
            <Text style={{color:'white'}}>{'Хадгалах'}</Text>
      </TouchableOpacity>
     </View>:null}
    
     <View style={{flexDirection:'row',paddingHorizontal:10,height:70,width:'100%',backgroundColor:"#fff",borderBottomRightRadius:20,borderBottomLeftRadius:20,borderBottomColor:'#4dd8f7',justifyContent:'space-between',alignItems:'center'}}> 
              <Text style={{color:'black',width:'70%'}}>{'Үгсийн сан болон зар мэдээ шинэчлэх'}</Text> 
              {donwloading?
                <ActivityIndicator style={{width:70,height:70,justifyContent:'center',alignItems:'center'}} size={'large'} color="#6aa8e6"/>
              :
               <TouchableOpacity onPress={update} style={{width:70,height:70,justifyContent:'center',alignItems:'center'}}>            
                  <SimpleLineIcons name="reload" size={30} color="#6aa8e6" />
               </TouchableOpacity>
              }
     </View>

     </ImageBackground>
  );

  
  async function getcontent(){
    
    
    return {
      title:"👩‍🏫 Өнөөдрийн үгээ цээжилнэ үү !",
      body:'📅 Смарт Календариас өдрийн үгээ цээжилж, шалгалт өгч баталгаажуулна уу ',
      ios: { sound: true },
      android: {
        "channelId": "chat-messages" //and this
             },
      sound: 'email-sound.wav',
      data:{screen:'Month',id:-1 },
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    paddingTop:20,
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
