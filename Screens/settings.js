import { StatusBar } from 'expo-status-bar';
import React,{useState,useRef,useEffect} from 'react';
import { StyleSheet, Text, View,Switch,Animated,ImageBackground,ActivityIndicator, Dimensions} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import Header from '../components/header'
import { CommonActions   } from '@react-navigation/native';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';
import AllService from '../services/allservice';
import Toast from 'react-native-tiny-toast'
import moment from "moment";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Settings(props) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
   getnotinfo()
    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    return () => {
     // Notifications.removeNotificationSubscription(notificationListener);
     // Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [on, setOn] = useState(true)
  const [data, setData] = useState({})
  const [donwloading, setDownloading] = useState(false)
  const [hour, setHour] = useState('0')
  const [minute, setMinute] = useState('0')
  const [hour2, setHour2] = useState('0')
  const [minute2, setMinute2] = useState('0')
  const [showdate1, setShowdate1] = useState(false)
  const [showdate2, setShowdate2] = useState(false)

  

 async function getnotinfo(){
    var data=await SecureStore.getItemAsync('info');
    data=JSON.parse(data);
    setData(data)
    setHour(data.nothour.toString())
    setMinute(data.notminut.toString())
    setHour2(data.nothour2.toString())
    setMinute2(data.notminut2.toString())
  }
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={styles.container}> 
      <Header navigation={props.navigation} url={""} params={{}}  title={'Тохиргоо'}/>
         

     <View style={{flexDirection:'row',paddingHorizontal:10,height:70,borderTopLeftRadius:20,borderTopRightRadius:20,marginTop:10, width:'100%',borderBottomWidth:0.3,backgroundColor:"#fff",borderBottomColor:'#4dd8f7',justifyContent:'space-between',alignItems:'center'}}> 
              <Text style={{width:'70%'}}>{'Цээжлэх үгийн мэдэгдэл хүлээн авах'}</Text>             
                <Switch
                  trackColor={{ false: "#767577", true: "#4dd8f7" }}
                  thumbColor={on ? "#6aa8e6" : "#f4f3f4"}
                  
                  ios_backgroundColor="#6aa8e6"
                  onValueChange={()=>{setonoff()}}
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
                      {/* <DateTimePickerModal
                          isVisible={showdate1}
                          mode='time'
                          onConfirm={(e)=>{setHour(e.getHours().toString()),setMinute(e.getMinutes().toString())}}
                          onCancel={()=>setShowdate1(false)}
                        />
                      <DateTimePickerModal
                          isVisible={showdate2}
                          mode='time'
                          onConfirm={(e)=>{setHour2(e.getHours().toString()),setMinute2(e.getMinutes().toString())}}
                          onCancel={()=>setShowdate2(false)}
                        /> */}
                </View>
                
      </View>
      <TouchableOpacity onPress={()=>setNotif()} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7',height:40,width:100,marginTop:5,borderRadius:10,marginBottom:5}}>
            <Text style={{color:'white'}}>{'Хадгалах'}</Text>
      </TouchableOpacity>
     </View>:null}
    
     <View style={{flexDirection:'row',paddingHorizontal:10,height:70,width:'100%',backgroundColor:"#fff",borderBottomRightRadius:20,borderBottomLeftRadius:20,borderBottomColor:'#4dd8f7',justifyContent:'space-between',alignItems:'center'}}> 
              <Text style={{color:'black',width:'70%'}}>{'Үгсийн сан болон зар мэдээ шинэчлэх'}</Text> 
              {donwloading?
                <ActivityIndicator style={{width:70,height:70,justifyContent:'center',alignItems:'center'}} size={'large'} color="#6aa8e6"/>
              :
               <TouchableOpacity onPress={()=>update()} style={{width:70,height:70,justifyContent:'center',alignItems:'center'}}>            
                  <SimpleLineIcons name="reload" size={30} color="#6aa8e6" />
               </TouchableOpacity>
              }
     </View>

     </ImageBackground>
  );
//   <TouchableOpacity onPress={()=>{relogin()}} style={{flexDirection:'column',width:(Dimensions.get('window').width),borderBottomWidth:0.3,backgroundColor:"#fff",height:70,justifyContent:'flex-start',alignItems:'flex-start'}}> 
//   <Text style={{color:'grey',width:'40%',height:70,textAlign:'center',textAlignVertical:'center',marginLeft:10}}>{'Шинэ холболт үүсгэх'}</Text> 

// </TouchableOpacity>
  async function relogin(){
    await SecureStore.deleteItemAsync('info');
    const query11 = `delete  from companyinfo2`;
    await db.transaction(trx => {
          let trxQuery = trx.executeSql(
              query11
              ,[]
              ,(transact,resultset) =>{ }
          )})
          const query = `select * from medee`;
          await db.transaction(trx => {
                let trxQuery = trx.executeSql(
                    query
                    ,[]
                    ,(transact,resultset) =>{ 
                      try{             
                          var allnews=resultset.rows._array.map(async news=>{
                                    if(news.topimage!='')
                                    {    
                                        var imagename=news.topimage.split('/');
                                        imagename=imagename[imagename.length-1]
                                        var filepath=FileSystem.documentDirectory + imagename;
                                        let tmp = await FileSystem.getInfoAsync(filepath);
                                        if(tmp.exists)
                                        {
                                          console.log('zurag ustgaj baina :'+filepath)
                                          try{
                                             await FileSystem.deleteAsync(filepath);
                                          }catch(e){
                                           console.log('zurag ustaj chadaagui:'+filepath)
                                          }
                                        }
                                        return({});
                                    }
                                    else
                                      return ({});
                             })
                             Promise.all(allnews).then(async function(results) {
                                 
                              const query22= `delete  from medee`;
                              await db.transaction(trx => {
                                    let trxQuery = trx.executeSql(
                                        query22
                                        ,[]
                                        ,(transact,resultset) =>{ 
                                          Notifications.cancelAllScheduledNotificationsAsync()
                                          props.navigation.navigate('Login')
                                          props.navigation.dispatch(
                                            CommonActions.reset({
                                              index: 0,
                                              routes: [
                                                {
                                                  name: 'Login',                       
                                                },
                                              ],
                                            })
                                          );
                                          

                                        },(transact,error)=>console.log(error)
                                    )}
                                     
                                    )
                             }) 
                            }
                            catch(e){console.log(e)}
                           },(transact,error)=>{console.log(error)}
                           )
                       
                    }
                    ,(transact,err) => console.log('error occured ', err)
              );
  
  }
  async function update() {  
         let service = new AllService();
          service.GetAbout().then(result=>result.json()).then(async result=>{

            try {
              const query = `insert into companyinfo2(mail,facebookurl,address,about,trialtext,phone,date) values ('${result.mail}','${result.facebookurl}','${result.address}','${result.about}','${result.trialText}','${result.phone}','${result.updateognoo}');`;
              db.transaction(trx => {
                  let trxQuery = trx.executeSql(
                      query
                      ,[]
                      ,(transact,resultset) => console.log(resultset)
                      ,(transact,err) => console.log('error occured ', err)
                );
              })
            } catch (error)
              {
                console.log(error)
              }
          })            
          var data=await SecureStore.getItemAsync('info');
          data=JSON.parse(data);
          setDownloading(true)    
          var query="delete from D03";
                  db.transaction((tx)=>{
                     tx.executeSql(query,[],(tx,result)=>{ 
                       console.log('base cleared')                      
                    },(tx,result)=>{
                   
                  })
                  })   
          
             await service.GetCalendarWords(data.token).then(result=>result.json()).then(async result=>{
             await result.forEach(async el => {
                            var query="INSERT INTO D03(D0300,D0301,D0302,D0303,D0304,D0305,D0306,D0307) VALUES ((?),(?),(?),(?),(?),(?),(?),(?))";
                            await db.transaction(async (tx)=>{
                              await tx.executeSql(query,[el.index,el.engword,el.monword,el.wordclass,el.date,el.audio,'',el.tp],(tx,result)=>{                                       
                              },(tx,result)=>{
                            })
                            })
                           
                                  
              }); 
               
            }) 
            db.transaction((tx)=>{
              var query="select count(*) from D03";
               tx.executeSql(query,[],async (tx,result)=>{ 
                  var data=await SecureStore.getItemAsync('info');
                  data=JSON.parse(data);
                  var token = data.token;
                    const query = `select * from medee order by newsid desc`;
                  await db.transaction(trx => {
                        let trxQuery = trx.executeSql(
                            query
                            ,[]
                            ,(transact,resultset) =>{ 
                               var lastindex=0;
                               if(resultset.rows._array.length>0)
                               {
                                 lastindex=resultset.rows._array[0].newsid
                               }               
                                 service.Getreklams(token,lastindex).then(result=>result.json())
                                 .then(result=>{              
                                  var allnews=result.map(news=>{
                                            if(news.topimage!='')
                                            {    
                                                var imagename=news.topimage.split('/');
                                                imagename=imagename[imagename.length-1]
                                                const downloadResumable = FileSystem.createDownloadResumable(
                                                  news.topimage,
                                                  FileSystem.documentDirectory + imagename,
                                                  {},
                                                  (downloadProgress )=>{}
                                                );
                                                try {
                                                  downloadResumable.downloadAsync();           
                                                } catch (e) {
                                                  console.error(e);
                                                }
                                                news.topimage=FileSystem.documentDirectory + imagename;
                                                return(news);
                                            }
                                            else
                                              return (news);
                                     })
                                     Promise.all(allnews).then(async function(results) {
                                         //console.log(allnews)
                                         // console.log(JSON.stringify(allnews))
                                         //'CREATE TABLE IF NOT EXISTS  news(index integer,title text,newstext text,topimage text,date text,videourl text);'
                                          results.forEach(item => {
                                          const query = `insert into medee(title,newstext,topimage,date,videourl,newsid) values ('${item.title}','${item.newstext}','${item.topimage}','${item.date}','${item.videourl}',${item.index});`;
                                          db.transaction(trx => {
                                              let trxQuery = trx.executeSql(
                                                   query
                                                  ,[]
                                                  ,(transact,resultset) => console.log(resultset)
                                                  ,(transact,err) => console.log('error occured ', err)
                                             );
                                          })
                                         });
                                         setDownloading(false);   
                                         
                                     }) 
                                   }).catch(e=>console.log(e))
                               
                            }
                            ,(transact,err) => console.log('error occured ', err)
                      );
                    })
                                                 
              },(tx,result)=>{
              console.log(result);
            })
            })
         
    
      
  }
  async function setonoff(){
    setOn(!on)
    if(on)
    {
      Notifications.cancelAllScheduledNotificationsAsync()
      await SecureStore.setItemAsync('info', JSON.stringify({token:data.token,userid:data.userid,endtime:data.endtime,getnot:false,age:data.age,pos:data.pos,phone:data.phone,name:data.name,nothour:parseInt(hour),notminut:parseInt(minute),nothour2:parseInt(hour2),notminut2:parseInt(minute2)}));

    }
  }
  async function setNotif() {
    const settings = await Notifications.getPermissionsAsync();
    Notifications.setNotificationChannelAsync('new-emails', {
      name: 'E-mail notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'email-sound.wav', // <- for Android 8.0+, see channelId property below
    });
     Notifications.cancelAllScheduledNotificationsAsync()
      Notifications.scheduleNotificationAsync({
         content:await getcontent(),
         trigger: {hour:parseInt(hour),
         
          minute:parseInt(minute), repeats: true },
      });
       Notifications.scheduleNotificationAsync({
         content:await getcontent(),
         trigger: {hour:parseInt(hour2),

          minute:parseInt(minute2), repeats: true },
      });
     
      await SecureStore.setItemAsync('info', JSON.stringify({token:data.token,userid:data.userid,endtime:data.endtime,getnot:true,age:data.age,pos:data.pos,phone:data.phone,name:data.name,nothour:parseInt(hour),notminut:parseInt(minute),nothour2:parseInt(hour2),notminut2:parseInt(minute2)}));

      Toast.show('Амжилттай хадгалагдлаа',{
        position: Toast.position.BOTTOM,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
        textStyle: {},
        imgStyle: {},
        mask: true,
        maskStyle:{},
    
      })
 
  }
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
