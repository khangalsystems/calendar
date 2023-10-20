import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, Text, View,Platform} from 'react-native';
import {TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign,Ionicons } from '@expo/vector-icons'; 

export default function header(props) {
  
  return ( 
       <View style={styles.header}>
            <TouchableOpacity onPress={()=>props.url!=""?props.navigation.navigate(props.url,props.params):props.navigation.goBack()}  style={{width:50,marginLeft:2,borderRadius:20,backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 <Ionicons name="ios-arrow-back" size={50} color="black" />
            </TouchableOpacity>  
             <View style={{width:'80%'}}> 
             <Text style={{fontSize:18,flexWrap:'wrap',fontWeight:'bold',fontFamily:'myfont',marginRight:10,color:'black',textAlign:'center'}}>{props.title}</Text> 
            </View>    
      </View>      
  );
}

const styles = StyleSheet.create({
  header:{
     marginTop:Platform.OS=='ios'?Constants.statusBarHeight:0,
     flexDirection:'row',
     justifyContent:'flex-start',
     width:'100%',
     height:60,
     alignItems:'center'
  }
});
