import { StatusBar } from 'expo-status-bar';
import React,{useState,useRef,useEffect} from 'react';
import { StyleSheet, Text, View,Platform,Alert,ImageBackground,ActivityIndicator, Dimensions} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-tiny-toast'
import { BarCodeScanner } from 'expo-barcode-scanner';
import Appjson from "../app.json";
import AllService from '../services/allservice';
import * as Notifications from 'expo-notifications';
const width=Dimensions.get('window').width
export default function barcode({navigation,route}) {

  const [height, setHeight] = useState(width)
  const [textbarcode, setTextbarcode] = useState('')

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    (async () => {
   
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
  
  const handleBarCodeScanned = ({ type, data }) => {
    login(data);
  };
  
 

  return (
    
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={{width:'100%',height:Dimensions.get('window').height,justifyContent:"center"}} >
              <Text style={{color:'black',textAlign:'center',marginTop:20,paddingHorizontal:5}}>{'Идэвхжүүлэх код оруулна уу'}</Text>
        <View style={{flexDirection:'row',width:'70%',marginHorizontal:'15%',marginTop:10,alignItems:'center',justifyContent:'center'}}>
             <TextInput placeholder="Kод" maxLength={8} style={{borderRadius:20,borderWidth:1,height:30,width:'60%',paddingLeft:10,marginRight:10}} value={textbarcode} onChangeText={(e)=>setTextbarcode(e)}></TextInput>
               <TouchableOpacity onPress={()=>{ login(textbarcode)}}  style={{width:100,borderRadius:20,borderWidth:1,height:30,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Илгээх'}</Text>
                </TouchableOpacity>
        </View>
      
        <TouchableOpacity onPress={()=>{route.params.closeit(),navigatemonth()}}  style={{alignSelf:'center',width:height-100,borderRadius:20,marginTop:10,borderWidth:1,height:50,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Хаах'}</Text>
       </TouchableOpacity>
                </ImageBackground>
  );

  // {loading?<ActivityIndicator size={'large'} color={'#b3528e'}/>:
  // <View style={{width:width,height:'auto',alignItems:'center',position:'relative',backgroundColor:'transparent',marginTop:20,flexDirection:'column'}}>
  // <BarCodeScanner
  //     onBarCodeScanned={handleBarCodeScanned}
  //     style={{width:height,height:height+80}}
  // >
  // </BarCodeScanner>
  // 
  // </View>}
  function navigatemonth(){
    var d = new Date();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year=d.getFullYear();
    
    var day = d.getDate();
    navigation.navigate('Month',{'month':month,'year':year,'day':day})

  }
   async function login(barkodstr){
     if(barkodstr=="" || barkodstr.length!=8 )
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
    let service = new AllService();
    var data=await SecureStore.getItemAsync('info');
    data=JSON.parse(data)
    var notif =''

        try {
          var expnotif = await registerForPushNotificationsAsync();
          notif=expnotif.data
        } catch (error) {
          console.log('token: ', error);
        }
    //if(net.isInternetReachable)
        service.CheckTokenSaveUser(                                   
          data.name,data.phone,data.age,barkodstr,notif,data.posindex,(Platform.OS=='android'?1:2),Appjson.expo.version).then(result=>result.text()).then(async result=>{    
             console.log(result)  
            if((result!=='"-1"') && (result!=='"0"'))        
                {
                  console.log(result)
                       try {
                        var d = new Date()
                        var end=new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
                        await SecureStore.setItemAsync('info', JSON.stringify({posindex:data.posindex,token:barkodstr,userid:result.replace(/"/g,''),endtime:end.toISOString().split('T')[0],getnot:data.getnot,age:data.age,pos:data.pos,phone:data.phone,name:data.name,nothour:data.nothour,notminut:data.notminut,nothour2:data.nothour2,notminut2:data.notminut2}));
                        Toast.show('Календарь идэвхитэй боллоо '+end.toISOString().split('T')[0],{
                          position: Toast.position.BOTTOM,
                          containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
                          textStyle: {},
                          imgStyle: {},
                          mask: true,
                          maskStyle:{},                   
                        })
                        route.params.succ()
                        navigatemonth();
                      } catch (error)
                        {
                          console.log(error)
                        }
                  }
              else{
                if(result!='"-2"')
                  {
                      var msg=(result=='"-1"'?'Энэ календарийн qr кодыг 3 уншуулсан байна.Шинэ календарийн QR код уншуулна уу!':'Таны ашигласан код буруу байна!Кодыг календарын араас харна уу !')  
                      Toast.show(msg,{
                        position: Toast.position.BOTTOM,
                        containerStyle:{width:280,height:80,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
                        textStyle: {flexWrap:'wrap'},
                        imgStyle: {},
                        mask: true,
                        maskStyle:{},                   
                      })
                    }
                    else {
                      var msg=('Бүртгэлтэй утасны дугаар байна !')  
                      Toast.show(msg,{
                        position: Toast.position.BOTTOM,
                        containerStyle:{width:280,height:80,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
                        textStyle: {flexWrap:'wrap'},
                        imgStyle: {},
                        mask: true,
                        maskStyle:{},                   
                      })
                    }
                 }
              })
          .catch((err)=>console.log(err))
  
  }
  async function  registerForPushNotificationsAsync  () {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
       
        Alert.alert('Алдаа гарлаа', 'Failed to get push token for push notification!');
        return {data:'android device aas'};
      }
      return await Notifications.getDevicePushTokenAsync();
    } else {
      
      Alert.alert('Алдаа гарлаа', 'Must use physical device for Push Notifications');
      return {data:'android device aas'}
    }
  };
  
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
