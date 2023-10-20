import { StatusBar } from 'expo-status-bar';
import React ,{useState,useEffect} from 'react';
import { ActivityIndicator, Dimensions, StyleSheet,ImageBackground,Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function profile(props) {
 
  return (
    <TouchableOpacity onPress={()=>props.onclick(props.year,props.month)} style={styles.container}>
      
        <Text style={{fontWeight:'bold',color:props.color2}}>{props.month} сар</Text>
        <View style={styles.dayscontainer}>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Да'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Мя'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Лх'}</Text>
        </View>
        <View style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Пү'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Ба'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Бя'}</Text>
        </View>
        <View style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:props.color2,margin:0.5}}>{'Ня'}</Text>
        </View>
       
        </View>
       
        <View style={styles.dayscontainer}>
         {props.days.map((e,i)=>{         
     return <View key={i} style={{width:'13%',height:15,justifyContent:'center',margin:0.5,marginVertical:0.5,backgroundColor:e.scorecolor!==''?e.scorecolor:e.amralt?props.color:'white',alignItems:'center'}}>
                  <Text     style={{fontSize:8,fontWeight:(e.score!=-1 || e.amralt)?'bold':'normal',color:e.score!=-1?'white':e.amralt?props.color2:'#61605e'}}>{e.day}</Text>
            </View>
                
         })}
         </View>
       
    </TouchableOpacity>
  )
  
}

const styles = StyleSheet.create({
  container: {
    width:Dimensions.get('window').width/3.15,
    height:'auto',
    borderRadius:20,  
    backgroundColor:'transparent',
    margin:0,
    flexDirection:'column',
  },
  dayscontainer:{
    width:Dimensions.get('window').width/3.15,
    flexDirection:'row',
    flexWrap:'wrap'
  },
  monthheader:{
      flexDirection:'row'
  },
  dayname:{
      marginLeft:5,
      fontSize:7
  }
});
