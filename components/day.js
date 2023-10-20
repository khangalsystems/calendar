import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { Dimensions, StyleSheet, Text, View ,TouchableOpacity} from 'react-native';


export default function Day(props) {
  
  return (
    <TouchableOpacity style={[styles.container,{ backgroundColor:props.daycolor}]} onPress={()=>props.onclick(props.day,props.weekday)}>
      <Text  style={{fontSize:12,padding:3}}>{props.day}</Text>     
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height:50,
    justifyContent:'center',
    width:'14%',
    borderRadius:50,
    alignItems:'center',
    backgroundColor:'grey'
  },
  
 
});
