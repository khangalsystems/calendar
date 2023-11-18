
import React,{useState,useEffect,useRef} from 'react';
import { Dimensions, StyleSheet, Text,ActivityIndicator,View,ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import { Audio } from 'expo-av';
import Carousel from 'react-native-snap-carousel-v4';
import Loader from './Loader';
import Toast from 'react-native-tiny-toast'
import {  TouchableOpacity } from 'react-native-gesture-handler';
import config from '../config.json'
import {Paths}from '../assets/list.js';
import dayjs from 'dayjs';
const db=SQLite.openDatabase(config.basename)
var rreef;
export default function words({currentDate,changeParentDay}) {
   const [words, setWords] = useState([])
   const [loading, setLoading] = useState(false)
   const [playing, setPlaying] = useState(-1)
   const [lastplayed, setLastplayed] = useState(-1)
   useEffect(() => {
    _askForAudioPermission();
    setLoading(true)
     var prevDate=dayjs(currentDate).add(-1,'day');
     var nextDate=dayjs(currentDate).add(1,'day');
     var data=[]  
     db.transaction(
            tx => {
              var qr='select * from word where date="'+prevDate+'"';          
              tx.executeSql(qr, [], async (trans, result) => {              
                var data1=result.rows._array.map(e=>{                
                 return {index:e.id,mong:e.mon,eng:e.eng,type:e.class,pron:e.audio}}) 
                 db.transaction(
                  tx => {
                    var qr='select * from word where date="'+currentDate+'"';          
                    tx.executeSql(qr, [], async (trans, result) => { 
                      var data2=result.rows._array.map(e=>{                
                       return {index:e.id,mong:e.mon,eng:e.eng,type:e.class,pron:e.audio}}) 
                       db.transaction(
                        tx => {
                          var qr='select * from word where date="'+nextDate+'"';          
                          tx.executeSql(qr, [], async (trans, result) => { 
                            var data3=result.rows._array.map(e=>{                
                             return {index:e.id,mong:e.mon,eng:e.eng,type:e.class,pron:e.audio}}) 
                              data.push(data1)
                              data.push(data2)
                              if(data3.length>0)
                                 data.push(data3)
                              setWords(data)                                               
                              if(rreef!=null) 
                                rreef.snapToItem (1,false)
                               setLoading(false)
                               },(tx,res)=>{console.log(res)});            
                              })
                         },(tx,res)=>{console.log(res)});            
                        })
                   },(tx,res)=>{console.log(res)});            
                  })
   }, [currentDate])

   async function playsound(req,i){
      if(playing==-1)
      {
            setPlaying(i)
            setLastplayed(i)
             try{
                const { sound: playbackObject } = await Audio.Sound.createAsync(
                  Paths[req.eng]
                );
                playbackObject.playAsync();
                playbackObject.setOnPlaybackStatusUpdate(playbackStatus =>{

                      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                        setPlaying(-1)
                        setLastplayed(i)
                      }
                   })
                }
                catch{
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
    async function  _askForAudioPermission (){
      const response = await Audio.requestPermissionsAsync();  
    };
   const changeDay=(e)=>{
    console.log(e)
    var newDate=dayjs(currentDate)
    if(e)
    newDate.add(-1,'day')
    else newDate.add(1,'day')
    changeParentDay(newDate.format('YYYY-MM-DD'))
   }
        return (
    <View style={styles.container}>
     <View style={{backgroundColor:"#1cb1ed",width:'86%',height:25,borderRadius:10}}>
        <Text style={{alignSelf:'center',fontFamily:"myfont",fontSize:16,color:'white',textAlign:'center',textAlignVertical:'center'}}>{`${currentDate} өдрийн цээжлэх үгс`}</Text>
        </View>
        {words.length>0 && !loading? 
        <Carousel
          ref={(c) => {rreef=c}}
          data={words}
          onSnapToItem={changeDay}
          renderItem={(e)=>_renderItem(e.item,e.index)}
          sliderWidth={Dimensions.get('window').width}
          firstItem={1}
          itemWidth={Dimensions.get('window').width} 
      />:<View  style={{width:'100%',height:'auto',justifyContent:'center',marginHorizontal:0,backgroundColor:'transparent',borderRadius:10}}>    
                  <Loader/>
        </View>}
    </View>
  );
  function _renderItem (item, index) {
    return (
      <ScrollView>
      <View key={index} style={{width:'100%',height:'auto',marginHorizontal:0,backgroundColor:'transparent',borderRadius:10}}>    
      {item.map((el,n)=>{
         return (
         <View   key={n} style={{flexDirection:'column'}}>
                  <View style={styles.wordhor}>
                        <TouchableOpacity   style={{alignSelf:'center',width:24,justifyContent:'center',marginLeft:20}} onPress={()=>playsound(el,n+1)}>
                            <AntDesign name="sound"  style={{alignSelf:'center'}} size={24} color={playing!=-1?playing===(n+1)?'#1cb1ed':"grey":lastplayed===(n+1)?'#1cb1ed':"black"}/>
                        </TouchableOpacity>
                        <View style={{width:'35%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <Text style={[styles.listword,{width:'80%',textAlign:'left',paddingLeft:10,color:'#1d79cf',fontFamily:'myfont'}]}>{el.eng}</Text>
                          <Text style={[styles.listword,{width:'20%',fontWeight:'500',fontSize:8,flexWrap:'wrap',color:'black',fontFamily:'myfont'}]}>{el.type===''?'':'('+el.type+')'}</Text>
                        </View>
                        <Text style={[styles.listword,{width:'45%',textAlign:'left',paddingLeft:30,color:'#1d79cf',fontFamily:'myfont'}]}>{el.mong}</Text>
                 </View>
                
               </View>
               )
       })}
      </View>
     </ScrollView>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'transparent',
    marginTop:10,
    marginBottom:20
  },
  wordlist:{
   flexDirection:'column',
   height:'auto'
  },
  wordhor:{
   flexDirection:'row',
   width:Dimensions.get('window').width-20,
   marginHorizontal:10,
   marginVertical:3,
   shadowColor: "#000000",
  
   alignItems:'center'
  },
  colheader:{
    width:'100%',
    flexDirection:'row'
  },
  headerwords:{
    textAlign:'center',
    fontWeight:'bold'
  },
  listword:{
    textAlign:'center',
    height:'auto',
    fontSize:15,
    textAlignVertical:'center'
  }
 
});
