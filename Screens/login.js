
import React, { useState,useEffect} from 'react';
import Constants from 'expo-constants';
import {ScrollView,TouchableWithoutFeedback,View,StyleSheet,Alert,Text,TextInput, Dimensions, ActivityIndicator,ImageBackground,Switch, Keyboard,TouchableOpacity, Platform} from 'react-native'
import { MaterialIcons,FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons'; 
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import AllService from '../services/allservice';
import Toast from 'react-native-tiny-toast'
import Appjson from '../app.json';
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import Modal from "react-native-modal";
import config from '../config.json'
import dayjs from 'dayjs';
import { downloadWords } from '../functions/downloadWords';
import { useDispatch } from 'react-redux';
import { setLogged } from '../store/reducer';
import { Provinces } from '../data/provinces';
import { post } from '../api/request';
import { downloadNews } from '../functions/downloadNews';
const db=SQLite.openDatabase(config.basename)
const screen_heigth=Dimensions.get('window').height
const item_width=screen_heigth<690?30:40
const LoginScreen = ({navigation,route}) => {
  const [showscanner,setShowscanner]=useState(false)
  const provinces=Provinces
  const [downloading, setDownloading] = useState(false);
  const [logining, setLoging] = useState(false);
  const [barkodstr,setBarkodstr]=useState('');
  const [postext,setPostext]=useState('Улаанбаатар');
  const [posdata,setPosdata]=useState([]);
  const [agetext,setAgetext]=useState('6-12 нас');
  const [posindex,setPosindex]=useState(0);
  const [name,setName]=useState('tesr');
  const [phone,setPhone]=useState('86963022');
  const [modal,setModal]=useState(false);
  const [modal2,setModal2]=useState(false);
  const [age,setAge]=useState(1);
  const [expoToken,setExpoToken]=useState(null);
  const net=NetInfo.useNetInfo();
  let service = new AllService();
  const dispatch=useDispatch()
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoToken(token));
    setPosdata(provinces);
    setPosindex(provinces[0].index);
  }, [])
 
  const handleBarCodeScanned = ({ type, data }) => {
    setShowscanner(false);
    setBarkodstr(data);
  };
  const login=async ()=>{  
    if(name.length===0 )
    {
      Toast.show('Нэр оруулна уу !',{
        position: Toast.position.TOP,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'},
        textStyle: {color:'#b3528e'},
        imgStyle: {},
        mask: true,
        maskStyle:{},                   
      }) 
     return; 
    }
    if( phone.length===0)
    {
      Toast.show('Утас оруулна уу !',{
        position: Toast.position.TOP,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'},
        textStyle: {color:'#b3528e'},
        imgStyle: {},
        mask: true,
        maskStyle:{},                   
      }) 
     return;
    }
    post('/user/login',{
         phone:phone,
         name:name,
         ageGroup:age,
         district:posindex,
         notifToken:expoToken,
         regDate:dayjs()
    }).then(async e=>{
        if(e && e.success)
        {
              setLoging(true)
              setDownloading(true)
              const result=await downloadWords()
              const result2=await downloadNews()

              setDownloading(false)
              setLoging(false)
              await SecureStore.setItemAsync('userId',String(e.data.id))
              await SecureStore.setItemAsync('info',JSON.stringify(e.data))
              await SecureStore.setItemAsync('notif1','11:00')
              await SecureStore.setItemAsync('notif2','14:00')
              await SecureStore.setItemAsync('takeNotif','1')
              await SecureStore.setItemAsync('trailDate',dayjs().add(14,'days').format('YYYY-MM-DD'))
              dispatch(setLogged(true))
        }
    }).catch(e=>console.log(e))

   
  }

  return (
    <TouchableWithoutFeedback style={{width:'100%',height:screen_heigth}} onPress={()=>Keyboard.dismiss()}>
     <ImageBackground source={require('../assets/back2.png')} imageStyle={{opacity:0.7}} resizeMode='cover'  style={styles.container}>

      {downloading?<View style={{flexDirection:'column',flexWrap:'wrap',width:'80%',marginHorizontal:'10%',marginTop:screen_heigth/2,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size={'large'} color={'white'}/><Text style={{textAlign:'center',width:'100%',color:"white"}}>{'Смарт Календарийн цээжлүүлэх 3000 үгийн санг татаж байна.Та түр хүлээнэ үү !'}</Text></View>:
           <View style={styles.logincontainer}>
               
  
               
              <TextInput 
                placeholder="Нэр оруулна уу"  
                placeholderTextColor="#d7d7d9"                
                onFocus={()=>{}}
                value={name}
                onChangeText={e=>setName(e)}
                onBlur={()=>{}}
                style={styles.txtinput}
               />
               <TextInput 
                placeholder="Утас оруулна уу"    
                placeholderTextColor="#d7d7d9"                 
                onFocus={()=>{}}
                value={phone}
                keyboardType={'number-pad'}
                onChangeText={e=>setPhone(e)}
                onBlur={()=>{}}
                style={styles.txtinput}
               />
                <TouchableOpacity  style={styles.province}  onPress={()=>setModal2(true)}>
                    <Text style={{color:'white',marginLeft:5,width:'80%'}}>{agetext}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} style={{width:'20%',alignSelf:'center'}} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.province} onPress={()=>setModal(true)}>
                    <Text style={{color:'white',marginLeft:5,width:'80%'}}>{postext}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} style={{width:'20%',alignSelf:'center'}} color="white" />
                </TouchableOpacity>
           

                <TouchableOpacity style={styles.login} activeOpacity={logining ? 1 : 0.7} onPress={!logining && login} > 
                  {logining?<ActivityIndicator size="small" color="#b3528e"/>
                              :<Text style={{color:'#b3528e',textTransform:'uppercase',fontWeight:'bold'}}>{'КАЛЕНДАРь НЭЭХ'}</Text>
  }
                </TouchableOpacity>
                
                {showscanner?
                <View style={{width:300,height:'auto',position:'absolute',backgroundColor:'transparent',marginTop:50,flexDirection:'column'}}>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={{width:'100%',height:400}}
                >
                </BarCodeScanner>
                <TouchableOpacity onPress={()=>setShowscanner(false)} style={{width:'100%',borderBottomLeftRadius:20,borderBottomRightRadius:20,height:50,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Хаах'}</Text>
                </TouchableOpacity>
                </View>:null}  
                      <Modal visible={modal2}>
                          <TouchableWithoutFeedback  onPress={()=>setModal2(false)}>
                              <View style={styles.modalOverlay} ></View>
                          </TouchableWithoutFeedback>  
                          <ImageBackground source={require('../assets/back2.png')} imageStyle={{opacity:0.4}} resizeMode='cover'  style={styles.Modal}>
                                {['6-12 нас','13-18 нас','19 дээш нас'].map((e,i)=>{
                                  return(
                                  <TouchableOpacity  key={i} style={{height:50,marginLeft:20,flexDirection:'row',width:150,justifyContent:'flex-start',alignItems:'center'}} onPress={()=>{setModal2(false),setAgetext(e),setAge(i+1)}}> 
                                    <FontAwesome name="child" size={10*(i+1)} color="white" />
                                    <Text style={{color:'#b3528e',fontSize:16,marginLeft:20,fontWeight:'bold',textAlign:'center',textAlignVertical:'center'}} >{e}</Text>
                                   </TouchableOpacity>
                                )} )}  
                                <TouchableOpacity style={{height:40,width:250,borderBottomLeftRadius:20,borderBottomRightRadius:20,backgroundColor:'white',justifyContent:'center'}} onPress={()=>setModal2(false)}>
                                  <Text style={{color:'#b3528e',textTransform:'uppercase',fontWeight:'bold',textAlign:'center'}}>{'ХААХ'}</Text>
                                </TouchableOpacity>                  
                          </ImageBackground>
                      </Modal> 
                      <Modal visible={modal}>
                          <TouchableWithoutFeedback  onPress={()=>setModal(false)}>
                              <View style={styles.modalOverlay} ></View>
                          </TouchableWithoutFeedback>  
                          <ImageBackground source={require('../assets/back2.png')} imageStyle={{opacity:0.4}} resizeMode='cover'  style={[styles.Modal,{height:300}]}>
                                <ScrollView height={260}>
                                {posdata.map((e,i)=>{
                                  return(
                                  <TouchableOpacity  key={i} style={{height:50,marginLeft:20,flexDirection:'row',width:150,justifyContent:'flex-start',alignItems:'center'}} onPress={()=>{setModal(false),setPostext(e.name),setPosindex(e.index)}}> 
                                    <MaterialCommunityIcons name="city-variant-outline" size={24} color="white" />
                                    <Text style={{color:'#b3528e',fontSize:16,marginLeft:20,fontWeight:'bold',textAlign:'center',textAlignVertical:'center'}} >{e.name}</Text>
                                   </TouchableOpacity>
                                )} )} 
                                  </ScrollView>
                                <TouchableOpacity style={{marginBottom:-10,height:40,width:250,borderBottomLeftRadius:20,borderBottomRightRadius:20,backgroundColor:'white',justifyContent:'center'}} onPress={()=>setModal(false)}>
                                  <Text style={{color:'#b3528e',textTransform:'uppercase',fontWeight:'bold',textAlign:'center'}}>{'ХААХ'}</Text>
                                </TouchableOpacity>                  
                          </ImageBackground>
                      </Modal>             
           </View>}
              <View style={{marginBottom:40,bottom:0,position:'absolute',justifyContent:'center',alignItems:'center',flexDirection:'column'}}> 
                  <Text style={{color:'white',textAlign:'center'}}>{dayjs().year()}{'© SmartCalendar'}</Text>
                   <Text style={{color:'white',textAlign:'center'}}>{'Version '+Appjson.expo.version}</Text>
                </View>
         </ImageBackground> 
       </TouchableWithoutFeedback>
   
  );
  

  async function savingNews()
  {
    
    var query="delete from medee";
    db.transaction((tx)=>{
       tx.executeSql(query,[],(tx,result)=>{ 
         console.log('medee cleared')                      
      },(tx,result)=>{
      
    })
    })            
                   service.Getreklams('0',0).then(result=>result.json())
                   .then(result=>{     
                    var allnews=result.map(async news=>{
                              if(news.topimage!='')
                              {   
                                
                                  var imagename=news.topimage.split('/');
                                  imagename=imagename[imagename.length-1]
                                  var filepath=FileSystem.documentDirectory + imagename;
                                  let tmp = await FileSystem.getInfoAsync(filepath);
                                    if(tmp.exists!=true)
                                      { console.log('zurag baigaagui')
                                        const downloadResumable = FileSystem.createDownloadResumable(
                                          news.topimage,
                                          filepath,
                                          {},
                                          (downloadProgress )=>{}
                                        );
                                        try {
                                          console.log('zurag tataj baina :'+filepath)
                                          downloadResumable.downloadAsync(); 
                                          news.topimage=filepath;
                                           return(news);          
                                        } catch (e) {
                                          console.log('zurag aldaa:'+e);
                                          return(news); 
                                        }
                                      }
                                      else{ console.log('zurag baisan')
                                      return(news); 
                                    }
                               
                                  
                                }
                              else
                                return (news);
                       })
                     Promise.all(allnews).then(async function(results) {
                            var bar=new Promise((resolve,reject)=>{
                              resolve(results.forEach(item => {
                                const query = `insert into medee(title,newstext,topimage,date,videourl,newsid) values ('${item.title}','${item.newstext}','${item.topimage}','${item.date}','${item.videourl}',${item.index});`;
                                db.transaction(trx => {
                                    let trxQuery = trx.executeSql(
                                        query
                                        ,[]
                                        ,(transact,resultset) => console.log('medee save')
                                        ,(transact,err) => console.log('error occured ', err)
                                  );
                                })
                              }));
                            })   
                      }) 
               }).catch(e=>console.log('news err'+e))
                 
            
      
      
  }
  async function setNotif() {
   
    await Notifications.scheduleNotificationAsync({
      content:await getcontent(),
      trigger: {hour:11,

       minute:0, repeats: true },
   });
      await Notifications.scheduleNotificationAsync({
        content:await getcontent(),
        trigger: {hour:14,

         minute:0, repeats: true },
     });
    }  
    async function getcontent(){
      var date=moment();
      var month = date.format('M');
      var day   = date.format('D');
      var year  = date.format('YYYY');
      var date0=parseInt(year)+"-"+(month>=10?month:'0'+month)+"-"+(day>=10?day:'0'+day);
    
  
      return {
        title:"👩‍🏫 Өнөөдрийн үгээ цээжилнэ үү !",
        body:'📅 Смарт Календариас өдрийн үгээ цээжилж, шалгалт өгч баталгаажуулна уу ',
        ios: { sound: true },
        android: {
          "channelId": "chat-messages" //and this
               },
        data: { screen:'Main'},
      }
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

  if (Device.isDevice) {
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

};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    height:screen_heigth+50,

    alignItems:'center'
  },
  login:{
     height:item_width,
     backgroundColor:'white',
     width:250,
     justifyContent:'center',
     alignItems:'center',
     marginHorizontal:'5%',
     borderRadius:50,
     marginTop:item_width

  },
  txtinput:{
    height:item_width,
    marginVertical:item_width-25,
    width:'90%',
    color:'white',
    marginHorizontal:'5%',
    borderBottomWidth:0.3,
    borderBottomColor:'white',
    paddingLeft:6
  },
  province:{
    height:item_width,
    marginVertical:10,
    width:'90%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:'5%',
    borderBottomWidth:0.3,
    borderBottomColor:'white',
  },
  logincontainer:{
     opacity:1,
     backgroundColor:'transparent',
     width:'80%',
     marginTop:100,
     backgroundColor:'rgba(22, 22, 22, 0.5)',
     alignItems:'center',
     borderRadius:30,
     justifyContent:"center",
     height:screen_heigth/1.7
  },
  Modal:{
    alignSelf:"center",
    height:180,
    paddingTop:25,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
    backgroundColor:'white',
    borderColor: "white",
    width:250,
    position: 'relative'
  },
  modalOverlay: {
    position: 'absolute',
    alignSelf:'center',
    width:Dimensions.get('window').width+50, 
    height:Dimensions.get('window').height+50, 
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});