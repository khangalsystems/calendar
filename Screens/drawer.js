
import React,{useEffect,useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import Appjson from '../app.json';
import { StyleSheet,Animated, Text, View,ImageBackground, Dimensions, ActivityIndicator} from 'react-native';
import { FontAwesome,MaterialIcons,Ionicons,AntDesign,MaterialCommunityIcons} from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
const screen_height=Dimensions.get('window').height
const item_width=screen_height>600?50:40
export default function Drawer(props) {
  const [data, setData] = useState({name:' ',phone:'daw'})
  const [name, setName] = useState(' ')
  const [phone, setPhone] = useState(' ')
  useEffect(() => {
   

    getinfo()

   return ()=>{
     
   }
 }, [])
 async function getinfo(){
  var data=await SecureStore.getItemAsync('info');
  if(data!=null)
   {data=JSON.parse(data);
   setData({data})
   setName(data.name===undefined?' ':data.name)
   setPhone(data.phone===undefined?' ':data.phone)
   }
}

if(data.name!='')
  return (
     <ImageBackground source={require('../assets/back2.png')} resizeMode='stretch'  style={styles.container} imageStyle={{opacity: 0.5}}>
          <View style={{flexDirection:'column',height:'auto',marginVertical:20,justifyContent:'center',alignItems:'center'}}> 
                <View style={{width:'50%',height:item_width+40,padding:10,backgroundColor:'#1cb1ed',borderRadius:20}}>
                   <AntDesign name="user" size={item_width+20} color="white" />
                 </View>
            
                 <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                   <Text style={{fontFamily:'myfont',fontSize:item_width-23,marginVertical:5,color:'white'}}>{name}</Text>
                   <Text style={{fontFamily:'myfont',fontSize:item_width-33,color:'white'}}>{phone}</Text>
                 </View>
          </View>
       
       
        <TouchableOpacity style={[styles.item,{borderBottomColor:'#1cb1ed'}]} onPress={()=>props.navigation.navigate('Main',{"fromhome":true})}>
                 <AntDesign name={"home"}  size={34} color={"#1cb1ed"} />
                 <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Нүүр'}</Text> 
                 <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>   
         
        </TouchableOpacity>
       
        <TouchableOpacity style={[styles.item,{borderBottomColor:'#1cb1ed'}]} onPress={()=>props.navigation.navigate('Profile')}>
                 <AntDesign name="user" size={30} color={"#1cb1ed"} />
                 <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Хувийн мэдээлэл'}</Text> 
                 <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>             
        </TouchableOpacity>
        
      
        <TouchableOpacity  onPress={()=>props.navigation.navigate('Settings')} style={[styles.item,{borderBottomColor:'#1cb1ed'}]}>                
                <MaterialIcons name="settings-applications" size={30} color={"#1cb1ed"} />
                 <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Тохиргоо'}</Text>
                 <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>         
        </TouchableOpacity>


      



        <TouchableOpacity style={[styles.item,{borderBottomColor:'#1cb1ed'}]} onPress={()=>props.navigation.navigate('Competition')}>                 
                 <FontAwesome name="newspaper-o" size={25} color={'#1cb1ed'} />
                 <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Зар, мэдээ'}</Text>
                 <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>   
        </TouchableOpacity>

        <TouchableOpacity style={[styles.item,{borderBottomColor:'#1cb1ed'}]} onPress={()=>props.navigation.navigate('Aboutus')}>                 
                  <Ionicons name="ios-people" size={30} color={"#1cb1ed"} />
                  <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Календарийн тухай'}</Text>
                  <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>   
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item,{borderBottomColor:'#1cb1ed'}]} onPress={()=>props.navigation.navigate('phone')}>                 
                    <MaterialCommunityIcons  name="phone-settings" size={30} color="#1cb1ed" />
                  <Text style={{color:'#1cb1ed',fontFamily:'myfont',fontSize:15,marginLeft:20}}>{'Холбоо барих'}</Text>
                  <MaterialIcons name={"keyboard-arrow-down"} size={34} color="#1cb1ed" style={{right:10,position:'absolute'}}/>   
        </TouchableOpacity>
        <View style={{position:'absolute',bottom:65,height:1,backgroundColor:'white',width:'100%'}}/>
        <Text style={{position:'absolute',bottom:45,alignSelf:'center',textAlign:'center',color:'white'}}>{new Date().getFullYear()+' он  Смарт Календарь'}</Text>
        <Text style={{position:'absolute',bottom:25,alignSelf:'center',textAlign:'center',color:'white'}}>{'Version:'+Appjson.expo.version}</Text>
      </ImageBackground>
  
  );
  else return (<ActivityIndicator />)
}
//onPress={()=>props.navigation.navigate('Settings')}
//      <ImageBackground source={require('../assets/back2.png')} resizeMode='stretch'  style={{height:Dimensions.get('window').height+20}} imageStyle={{opacity: 0.1}}>
//       <LinearGradient style={styles.container} start={{x:1,y:0}} end={{x:0,y:1}} colors={['#fff','#fff','#fff','#fff','#dadde3','#a4fca7','#f2dc79','#91bcf2']}>

const styles = StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    height:Dimensions.get('window').height
  },
  item:{
    borderBottomWidth:2,
    paddingLeft:10,
    width:Dimensions.get('window').width/1.7,
    backgroundColor:'white',
    borderRadius:5,
    marginVertical:3,
    justifyContent:'flex-start',
    alignItems:'center',
    flexDirection:'row',
    height:item_width
  }
});
