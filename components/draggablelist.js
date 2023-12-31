
import React,{useState,useRef} from 'react';
import "react-native-gesture-handler";
import { Audio } from 'expo-av';
import { Dimensions, StyleSheet,Text, View,TouchableOpacity,ImageBackground,TouchableWithoutFeedback} from 'react-native';
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer } from "react-native-draggable-flatlist";
import { AntDesign } from '@expo/vector-icons'; 
import {Paths}from '../assets/list.js';
import Toast from 'react-native-tiny-toast'
import { FlatList } from "react-native";
import { useEffect } from 'react';
const screen_height=Dimensions.get('window').height
const screen_width=Dimensions.get('window').width

const list_item=screen_height>690?60:50
export default function draggeble({data,data2,changedata2}) {
    const [playing, setPlaying] = useState(false)
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
           change(0,1)
    },[])
    async function playsound(eng){
        if(!playing)
        {
                setPlaying(true)
                  try
                  {
                    const { sound: playbackObject } = await Audio.Sound.createAsync(
                      Paths[eng]
                    );
                    playbackObject.playAsync();
                    playbackObject.setOnPlaybackStatusUpdate(playbackStatus =>{
    
                          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                            setPlaying(false)
                          // setLastplayed(i)
                          }
                      })
                      }
                    catch(e){
                      console.log('error'+e);
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
            disabled={isActive}
            
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
              borderColor:'grey'
            }}
          >
             <TouchableOpacity   style={{alignSelf:'center',width:'20%',justifyContent:'center',marginLeft:10}} onPress={()=>playsound(item.eng)}>
                     <AntDesign name="sound"  style={{alignSelf:'center'}} size={24} color={playing?"grey":"black"}/>
             </TouchableOpacity>
            <Text
              style={{
                fontFamily:'myfont',
                marginLeft:10,
                color: "#1d79cf",
                textAlign:'center',
                fontSize:15,
              }} 
            >
              {item.eng}
            </Text>
          </View>
        );
      };
  return (
      <View style={{borderRadius:20,flexDirection:'row',marginTop:10,borderRadius:20,width:'100%',height:'auto',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                <FlatList
                  data={data}
                  scrollEnabled={false}
                  dragItemOverflow={false}
                  style={{borderRadius:20,width:screen_width/2}}
                  renderItem={({ item, index})=>renderItem2(item, index)}
                  keyExtractor={(item, index) => `${item.index}`}
                  />
                  <NestableScrollContainer>
                    <NestableDraggableFlatList
                           data={data2}
                           style={{flex:1}}
                           renderItem={({ item, index, drag, isActive })=>renderItem(item, index, drag, isActive)}
                           keyExtractor={(item, index) => `${item.index}`}
                           onDragEnd={({ data,from,to }) =>{change(from,to)}}
                    />
                  </NestableScrollContainer>
        </View>
  );
  function change(from,to)
  {   
      console.log('dragged '+from+"-"+to)
      var newData=[...data2]
      var i=newData[from];
      newData[from]=newData[to];
      newData[to]=i;
      newData[to].dragged=true;
      changedata2(newData)
  }

}
