import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';
import { Audio } from 'expo-av';
import {Paths}from '../assets/list.js';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity,ImageBackground} from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { AntDesign,Entypo,FontAwesome5} from '@expo/vector-icons'; 
const screen_height=Dimensions.get('window').height
const list_item=screen_height>600?60:50
export default function result({navigation,route}) {
    const [playing, setPlaying] = useState(false)
    async function playsound(uri){
        if(!playing)
        {
           setPlaying(true)
              try{
                
                const { sound: playbackObject } = await Audio.Sound.createAsync(
                  Paths[uri]
                );
                playbackObject.playAsync();
                playbackObject.setOnPlaybackStatusUpdate(playbackStatus =>{

                      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                        setPlaying(false);
                       // setLastplayed(i)
                      }
                   })
              }
                   catch(e){
                     console.log(e)
                     Toast.show('Дуу алга байна !',{
                       position: Toast.position.center,
                       containerStyle:{width:'90%',backgroundColor:'#ff9966'},
                       textStyle: {},      
                       mask: true,
                       maskStyle:{},
                       });
                      setPlaying(false);
                   }                 
         }
         else{}
      }
    function renderItem( item, index, drag, isActive,mongol){
        return (
          <View
            style={{
              height:list_item,
              backgroundColor: item.fail===1?'green':item.fail===0?'white':'#de3a21',
              borderRadius: isActive ? 50 :0,
              borderBottomWidth:0.5,
              flexDirection:'row',
              fontFamily:'myfont',
              alignItems:'center',
              justifyContent:'center'
              
            }}
          >
            <Text
              style={{
                color: "white",
                flexWrap:'wrap',
                width:'80%',
                fontFamily:'myfont',
                backgroundColor:'transparent',
                textAlignVertical:'center',
                textAlign:'center',
                fontSize:isActive ? 18 : 15,
              }} 
            >
              {mongol?item.mong:item.eng}
            </Text>
            {item.fail===1?<FontAwesome5  tyle={{width:'20%',alignSelf:'center'}} name="smile" size={24} color="white" />:<Entypo name="emoji-sad" style={{width:'20%',alignSelf:'center'}} size={24} color="white" /> 
 
              }
          </View>
        );
      };
      function renderItem2( item, index, drag, isActive,mongol){
        return (
          <View
            style={{
              height:list_item,
              backgroundColor: 'white',
              borderRadius:0,
              alignItems: "center",
              borderWidth:0.3,
              flexDirection:'row',
              borderColor:'grey',
              justifyContent:'center'
              
            }}
          >
                <TouchableOpacity   style={{alignSelf:'center',width:'30%',justifyContent:'center',marginLeft:20}} onPress={()=>playsound(item.eng)}>
                     <AntDesign name="sound"  style={{alignSelf:'center'}} size={34} color={playing?"grey":"#1d79cf"}/>
              </TouchableOpacity>
            <Text
              style={{
                fontFamily:'myfont',
                color: "#1d79cf",
                flexWrap:'wrap',
                width:'80%',
                backgroundColor:'transparent',
                textAlignVertical:'center',
                textAlign:'left',
                fontSize:isActive ? 18 : 15,
              }} 
            >
              {item.eng}
            </Text>
           
          </View>
        );
      };
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={{flexDirection:'column',width:'100%',height:Dimensions.get('window').height-20,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
       <Text style={{fontFamily:'myfont',color:'#1d79cf',marginBottom:20,fontSize:15}}>{`${route.params.year}-${route.params.month<10?'0'+route.params.month:route.params.month}-${route.params.day<10?'0'+route.params.day:route.params.day} ны Шалгалтын хариу`}</Text>

        <View style={{flexDirection:'row',width:Dimensions.get('window').width-30,height:'auto',backgroundColor:'white'}}>
            <DraggableFlatList
                data={route.params.data1}
                renderItem={({ item, index, drag, isActive })=>renderItem2(item, index, drag, isActive,false)}
                keyExtractor={(item, index) => `kr-${item.eng}${index} `}
               // onDragEnd={({ data }) =>{props.changedata1(data);setData(data)}}
                />
                <View style={{width:1,backgroundColor:'black'}}></View>
                <DraggableFlatList
                data={route.params.data2}        
                renderItem={({ item, index, drag, isActive })=>renderItem(item, index, drag, isActive,true)}
                keyExtractor={(item, index) => `kr-${item.mong}${index} `}
               // onDragEnd={({ data }) =>{props.changedata2(data);setData2(data)}}
                />              
        </View>  

         <Text style={{marginVertical:10,fontSize:15,textAlign:'center',fontFamily:'myfont',color:'#1d79cf'}}>{'Ta '+route.params.fail+' алдсан байна !'+(route.params.fail!=0?' Алдаагаа шалгаад дахин оролдоно уу':' Танд баяр хүргэе ')}</Text>   
         <TouchableOpacity onPress={()=>{navigation.navigate('Month',{'day':route.params.day,'month':route.params.month}),route.params.checkalert()}} style={{width:150,height:40,backgroundColor:'#7de89a',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                         <Text style={{color:'white',fontFamily:'myfont'}}>{route.params.month+'-р сар руу Буцах '}</Text>
         </TouchableOpacity>              
   </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
