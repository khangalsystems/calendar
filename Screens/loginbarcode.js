import { StatusBar } from 'expo-status-bar';
import React,{useState,useRef,useEffect} from 'react';
import { StyleSheet, Text, View,Switch,Animated,ImageBackground,ActivityIndicator, Dimensions} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign,SimpleLineIcons } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-tiny-toast'

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Notifications from 'expo-notifications';
import AllService from '../services/allservice';

const width=Dimensions.get('window').width
export default function barcode({navigation,route}) {

  const [height, setHeight] = useState(width)
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
    // setShowscanner(false);
    // setBarkodstr(data);
    route.params.setbarcode(data)
    navigation.goBack()
  };
  
 

  return (
    
     
         <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={{width:'100%',height:Dimensions.get('window').height,alignItems:'center',justifyContent:'center'}} >
            <Text style={{color:'black',textAlign:'center',marginTop:20,paddingHorizontal:5}}>{'Календарийн сүүлийн хуудас дээрх QR кодыг уншуулна уу'}</Text>

            {loading?<ActivityIndicator size={'large'} color={'#b3528e'}/>:
                <View style={{width:width,height:'auto',alignItems:'center',position:'relative',backgroundColor:'transparent',marginTop:50,flexDirection:'column'}}>

                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={{width:height+10,height:height+80}}
                >
                </BarCodeScanner>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}  style={{width:height-100,borderRadius:20,marginTop:10,borderWidth:1,height:50,backgroundColor:'white',justifyContent:'center'}}><Text style={{color:'#c75f9f',textAlign:'center'}}>{'Хаах'}</Text>
                </TouchableOpacity>
                </View>}
                </ImageBackground>
  );

   
  
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
