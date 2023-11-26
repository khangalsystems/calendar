
import React from 'react';
import Constants from 'expo-constants';
import { Dimensions, StyleSheet, Text, View,Image} from 'react-native';
import {TouchableOpacity } from 'react-native-gesture-handler';
export default function headermain(props) {

  return ( 
       <View style={styles.header}>           
            <Text style={{fontSize:30,marginLeft:20,borderBottomWidth:1,borderBottomColor:'#669ce3',color:'#669ce3'}}>2023 он</Text>
             <TouchableOpacity onPress={()=>props.navigation.openDrawer()}  style={{width:'100%',justifyContent:'center',backgroundColor:'transparent',alignItems:'center'}}>
                <Image   resizeMethod={'resize'} style={{width:60,height:40}}  source={require("../assets/03.png")} />
            </TouchableOpacity>     
      </View>      
  );
}

const styles = StyleSheet.create({
  header:{
     marginTop:Platform.OS=='ios'?Constants.statusBarHeight:0,
     justifyContent:'space-between',
     flexDirection:'row',
     width:Dimensions.get('window').width,
     height:60,
     alignItems:'center'
  }
});
