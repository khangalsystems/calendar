import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, Linking,View,Dimensions,ScrollView,TouchableOpacity,ImageBackground, TextInput,KeyboardAvoidingView, SafeAreaView, Keyboard} from 'react-native';
import Header from '../components/header'
import Toast from 'react-native-tiny-toast'
import * as SecureStore from 'expo-secure-store';
import { FontAwesome,Feather,Entypo,MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'

import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
import AllService from '../services/allservice';
export default function phone(props) {
  const [data, setData] = useState({address:'',mail:'',about:'',phone:''})
  const [sanal, setSanal] = useState('')
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
useEffect(() => {
    getinfo()
    return () => {
      
    }
}, [])
async function getinfo(){

    const query = `select * from companyinfo2`;
    await db.transaction(trx => {
          let trxQuery = trx.executeSql(
              query
              ,[]
              ,(transact,resultset) =>{
                  setData(resultset.rows._array[0])
               }
          )
      })
}
function face(){
  Linking.canOpenURL('fb-messenger://').then(supported => {
    if (!supported) {
      Toast.show('Facebook messanger нээх боломжгүй байна!',{
        position: Toast.position.BOTTOM,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
        textStyle: {},
        imgStyle: {},
        mask: true,
        maskStyle:{},
    
      })
   
    } else {
       Linking.openURL("fb-messenger://user-thread/" + data.facebookurl);
    }
}).catch(err => console.log(err));
}
function validateEmail(emailvar) {
  var mailformat =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return new RegExp(mailformat).test(emailvar);

}
async function sendmsg(){
  if(sanal.length!='')
  {
    if(email.length>0)
    {
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
      {
        Toast.show('Зөв И-мэйл хаяг оруулна уу !',{
          position: Toast.position.BOTTOM,
          containerStyle:{width:280,height:70,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
          textStyle: {flexWrap:'wrap'},
          imgStyle: {},
          mask: true,
          maskStyle:{},                  
        })
        return;
      }
    }
    let service = new AllService();
    var data=await SecureStore.getItemAsync('info');
      data=JSON.parse(data);
    service.savecomplain(sanal,email,data.userid).then((e)=>{
      setSent(true)
      Toast.show('Таны санал хүсэлтийг хүлээн авлаа',{
        position: Toast.position.BOTTOM,
        containerStyle:{width:250,height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#4dd8f7'},
        textStyle: {},
        imgStyle: {},
        mask: true,
        maskStyle:{},
      })
    }).catch(error=>{console.log(error)
      Toast.show('Санал хүсэлт илгээхэд алдаа гарлаа !',{
        position: Toast.position.BOTTOM,
        containerStyle:{width:280,height:70,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
        textStyle: {flexWrap:'wrap'},
        imgStyle: {},
        mask: true,
        maskStyle:{},                  
      })
    })
  }
  else{
    
    Toast.show('Санал хүсэлт бичнэ үү !',{
      position: Toast.position.BOTTOM,
      containerStyle:{width:280,height:70,justifyContent:'center',alignItems:'center',backgroundColor:'#de480d'},
      textStyle: {flexWrap:'wrap'},
      imgStyle: {},
      mask: true,
      maskStyle:{},                   
    })
  }
}
  return (
    <ScrollView>
          <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={styles.container}>
      <Header navigation={props.navigation} url={""} params={{}} title={'Холбоо Барих'}/>
     
         
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "height"}
      style={{flex:1,width:'100%'}}
       >
          
            <View style={styles.item}>
               <FontAwesome name="map-marker" size={24} style={{width:'10%'}} color="#84e3e3" />                 
               <Text style={{color:'black',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{data.address}</Text>
           </View>
           <View style={styles.item}>
               <Feather name="phone-call" size={24} color="#84e3e3" style={{width:'10%'}}/>                 
               <Text style={{color:'black',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'+976 '+data.phone}</Text>
           </View>
           <View style={styles.item}>
               <Entypo name="mail" size={24} color="#84e3e3" style={{width:'10%'}} />                
               <Text style={{color:'black',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{data.mail}</Text>
           </View>
             <TouchableOpacity style={styles.face} onPress={()=>face()}>
                 <MaterialCommunityIcons name="facebook-messenger" size={30} color="white" />
                    <Text style={{color:'white'}}>{' - холбогдох'}</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.mail} onPress={()=>Linking.openURL(`mailto:${data.mail}`)}>
                   <Entypo name="mail" size={30} color="white" />
                    <Text style={{color:'white'}}>{' - холбогдох'}</Text>
           </TouchableOpacity>
          {sent?  <Text style={{fontSize:16,marginTop:50,color:'#13d436',fontWeight:'bold',fontFamily:"myfont",marginBottom:5,textAlign:'center'}}>Санал хүсэлт ирүүлсэнд баярлалаа! </Text>: 
           <View style={{width:'90%',marginHorizontal:'5%',justifyContent:'center',alignItems:'center',marginVertical:20}}>
                   <Text style={{fontSize:16,color:'#024759',fontWeight:'bold',fontFamily:'myfont',marginBottom:5,textAlign:'center'}}>{'Смарт Календарь апп -тай холбоотой санал хүсэлтээ оруулна уу'}</Text>
                  <TextInput 
                      onChangeText={(e)=>setEmail(e)}
                      
                      placeholder={'И-мэйл хаягаа бичнэ үү '}
                      value={email}
                     
                      style={{borderWidth:1,width:'100%',fontFamily:"myfont",marginBottom:5,textAlignVertical:'top',height:45,borderRadius:20,padding:10}}
                    />
                    <TextInput 
                      onChangeText={(e)=>setSanal(e)}
                      multiline
                      placeholder={'Санал хүсэлтээ бичнэ үү '}
                      value={sanal}
                      style={{borderWidth:1,width:'100%',textAlignVertical:'top',height:130,borderRadius:20,padding:10}}
                    />
                      <TouchableOpacity style={styles.call} onPress={()=>sendmsg()}>
                             
                                  <Text style={{color:'white'}}>{'Илгээх  '}</Text>
                                  <MaterialIcons name="send" size={24} color="white" />
                      </TouchableOpacity>
             </View>}
        </KeyboardAvoidingView>
 
    </ImageBackground>
    </ScrollView>

  );
}
//holboo barih
{/* <TouchableOpacity style={styles.call} onPress={()=>Linking.openURL(`tel:${data.phone}`)}>
<FontAwesome name="phone-square" size={30} color="white" />
            <Text style={{color:'white'}}>{' - холбогдох'}</Text>
</TouchableOpacity> */}
const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  address:{
      width:'90%',
      marginHorizontal:'5%',
      flexDirection:'column',
      marginTop:20,
      alignItems:'center',
      height:Dimensions.get('window').height/2,
  },
  item:{
    width:'90%',
    marginHorizontal:'5%',
    height:'auto',
    marginBottom:10,
    flexDirection:'row'
  }
  ,
  face:{
    alignSelf:'center',
    width:250,
    height:60,
    borderRadius:20,
    marginVertical:5,
    backgroundColor:'#00C6FF',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  mail:{
    alignSelf:'center',
    width:250,
    height:60,
    marginVertical:5,
    borderRadius:20,
    backgroundColor:'#EA4335',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  call:{
    alignSelf:'center',
    width:200,
    height:50,
    marginVertical:5,
    borderRadius:20,
    backgroundColor:'#84e3e3',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  }
});
