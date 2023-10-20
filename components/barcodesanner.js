import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import {  TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-tiny-toast'

import { BarCodeScanner } from 'expo-barcode-scanner';
import AllService from '../services/allservice';

const width=Dimensions.get('window').width-20
export default function barcode(props) {

  const [height, setHeight] = useState(width)
  const [margin, setMargin] = useState(50)
  useEffect(() => {
    if(height===width)
      setHeight((width-10))
    else setHeight(width)
    setMargin(10)
    return () => {
    
    };
  }, [props.visible]);
  
  const handleBarCodeScanned = ({ type, data }) => {
    login(data);
  };
  
 
  if(props.visible)
  return (
    
     

                <View style={{width:300,height:'auto',alignItems:'center',position:'absolute',backgroundColor:'transparent',marginTop:50,flexDirection:'column'}}>
               
                <TouchableOpacity onPress={()=>{props.closeit()}}  style={{width:height-100,borderRadius:20,marginTop:10,borderWidth:1,height:50,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Хаах'}</Text>
                </TouchableOpacity>
                </View>
  );
  else{
    return null
  }
//   <BarCodeScanner
//   onBarCodeScanned={handleBarCodeScanned}
//   style={{width:height,height:height,marginHorizontal:margin}}
// >
// </BarCodeScanner>
   async function login(barkodstr){   
    let service = new AllService();
    var data=await SecureStore.getItemAsync('info');
    data=JSON.parse(data)
    var notif =''
        // try {
        //   notif = await registerForPushNotificationsAsync();
        //   console.log(notif)
        // } catch (error) {
        //   console.log('token: ', error);
        // }
    //if(net.isInternetReachable)
        service.CheckTokenSaveUser(
          data.name,data.phone,data.age,barkodstr,notif,1,(data.getnot?1:0)).then(result=>result.text()).then(async result=>{    
              if((result!=='"-1"') && (result!=='"0"'))        
                  {try {
                    await SecureStore.setItemAsync('info', JSON.stringify({token:barkodstr,userid:data.userid,endtime:'',getnot:data.getnot,age:data.age,pos:data.postext,phone:data.phone,name:data.name,nothour:data.nothour,notminut:data.notminut,nothour2:data.nothour2,notminut2:data.notminut2}));
                    Toast.show('Амжилттай хадгалагдлаа',{
                      position: Toast.position.BOTTOM,
                      containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
                      textStyle: {},
                      imgStyle: {},
                      mask: true,
                      maskStyle:{},
                  
                    })
                    props.showalways()
                  } catch (error)
                    {
                      console.log(error)
                    }
                  }
              else{
                alert(result=='"-1"'?'Тухайн кодыг гурван удаа ашиглах боломжтой~!':'Таны ашигласан код буруу байна!Кодыг календарын араас харна уу !')  
                 setShowalert(true);
                 setBarkodstr('') 
               }
              })
          .catch((err)=>console.log(err))
  
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
