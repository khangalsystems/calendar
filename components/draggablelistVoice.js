import Modal from "react-native-modal";
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Audio } from 'expo-av';
import { Dimensions, StyleSheet,Text, View,TouchableOpacity,ImageBackground,TouchableWithoutFeedback} from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { AntDesign } from '@expo/vector-icons'; 
import Toast from 'react-native-tiny-toast'
import {Paths}from '../assets/list.js';
const screen_height=Dimensions.get('window').height
const list_item=screen_height>690?60:50

export default function draggeble(props) {
    const [data,setData]=useState(props.data)
    const [data2,setData2]=useState(props.data2)   
    const [playing, setPlaying] = useState(-1)
    const [sound, setSound] = React.useState();
    const [lastplayed, setLastplayed] = useState(-1)
    React.useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync(); 
            setPlaying(-1)
          }
        : undefined;
    }, [sound]);
    async function playsound(uri,index){
      if(playing==-1)
      {
              try{
                  setPlaying(index)
                  const { sound: playbackObject } = await Audio.Sound.createAsync(
                    Paths[uri]
                  );
                  playbackObject.playAsync();
                  playbackObject.setOnPlaybackStatusUpdate(playbackStatus =>{
  
                        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                          setPlaying(-1);
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
                    setPlaying(-1);
                 }
      }
    }
      function renderItem( item, index, drag, isActive){
        return (
          <TouchableOpacity
            style={{
              height:list_item,
              backgroundColor: isActive ? "#7be8d6" :'transparent',// isActive ? "#7be8d6" : item.fail===1?'green':item.fail===0?'white':'red',
              borderRadius: isActive ? 50 :0,
              alignItems: "center",
              borderWidth:isActive?0:0.5,
              borderColor:'grey',
              justifyContent: "center"
            }}
            onPressIn={drag}
          >
            <Text
              style={{
                fontFamily:'myfont',
                color:item.dragged?'black': "#1d79cf",
                textAlign:'center',
                fontWeight:'normal',
                fontSize:isActive ? 18 : 15,
              }} 
            >
              {item.mong}
            </Text>
          </TouchableOpacity>
        );
      };
      function renderItem2( item, index){
        return (
          <View
            style={{
              height:list_item,
              backgroundColor:'transparent',// isActive ? "#7be8d6" : item.fail===1?'green':item.fail===0?'white':'red',
              borderRadius:0,
              flexDirection:'row',
              alignItems: "center",
              borderWidth:0.3,
              justifyContent:'center',
              borderColor:'grey'
            }}
          >
             <TouchableOpacity   style={{alignSelf:'center',width:'60%',justifyContent:'center',marginLeft:10}} onPress={()=>playsound(item.eng,index)}>
                     <AntDesign name="sound"  style={{alignSelf:'center'}} size={34} color={playing!=-1?playing===index?'#36c95e':"grey":lastplayed===index?"#36c95e":"#1d79cf"}/>
             </TouchableOpacity>
           
          </View>
        );
      };
  return (
    <View style={{borderRadius:20,flexDirection:'row',borderRadius:20,width:Dimensions.get('window').width-30,marginHorizontal:15,height:Dimensions.get('window').height-200,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
         <View style={{flexDirection:'row',width:Dimensions.get('window').width-80,height:'auto',backgroundColor:'transparent',borderRadius:20}}>
            <DraggableFlatList
                data={data}
                style={{borderRadius:20}}
                scrollEnabled={false}
                renderItem={({ item, index})=>renderItem2(item, index)}
                keyExtractor={(item, index) => `kr-${item.eng}${index} `}
                />
                
                <DraggableFlatList
                data={data2}
                scrollEnabled={false}
                dragItemOverflow={false}
                alwaysBounceVertical={false}
                style={{borderRadius:20}}
                renderItem={({ item, index, drag, isActive })=>renderItem(item, index, drag, isActive)}
                keyExtractor={(item, index) => `kr-${item.eng}${index} `}
                onDragEnd={({ data,from,to }) =>{change(data2,from,to)}}
                />
           </View>                    
        </View>
  );
  function change(data2,from,to)
  {
      var i=data2[from];
      data2[from]=data2[to];
      data2[to]=i;
      data2[to].dragged=true;
      setData2(data2)
      props.changedata2(data2)
  }
}

const styles = StyleSheet.create({
  container: {
    height:60,
    justifyContent:'center',
    width:'100%',
    alignItems:'center',
    backgroundColor:'grey'
  },
  Modal:{
    alignSelf:"center",
    height:'auto',
    backgroundColor: "#fff",
    paddingTop:25,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width:250,
    position: 'relative'
  },
  modalOverlay: {
    position: 'absolute',
    alignSelf:'center',
    width:Dimensions.get('window').width, 
    height:Dimensions.get('window').height, 
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
 
});
