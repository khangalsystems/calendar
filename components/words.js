
import React,{useState,useEffect,useRef} from 'react';
import { Dimensions, StyleSheet, Text,ActivityIndicator,View,ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import { Audio } from 'expo-av';
import Carousel from 'react-native-snap-carousel';
import Loader from './Loader';
import Toast from 'react-native-tiny-toast'
import {  TouchableOpacity } from 'react-native-gesture-handler';
import config from '../config.json'
import {Paths}from '../assets/list.js';
const db=SQLite.openDatabase(config.basename)
var rreef;
export default function words(props) {
   const net=NetInfo.useNetInfo();
   const [words, setWords] = useState([])
   const [index, setIndex] = useState(1)
   const [loading, setLoading] = useState(false)
   const [playing, setPlaying] = useState(-1)
   const [lastplayed, setLastplayed] = useState(-1)
   useEffect(() => {
    _askForAudioPermission();
    setLoading(true)
     var date0='';
     if((props.day-1)===0)
     {
       var last=new Date(props.year,(props.month-1),0).getDate()
       date0=''+props.year+'-'+(props.month-1<10?'0'+(props.month-1):(props.month-1))+'-'+last+'';
     }
     else{
         date0=''+props.year+'-'+(props.month<10?'0'+props.month:props.month)+'-'+((props.day-1)<10?'0'+(props.day-1):(props.day-1))+'';
     }
     var date=''+props.year+'-'+(props.month<10?'0'+props.month:props.month)+'-'+(props.day<10?'0'+props.day:props.day)+'';
     var date2='';
     var last2=new Date(props.year,props.month,0).getDate()
     if(props.day===last2)
     {      
       date2=''+props.year+'-'+(props.month+1<10?'0'+(props.month+1):(props.month+1))+'-01';
     }
     else{
       date2=''+props.year+'-'+(props.month<10?'0'+props.month:props.month)+'-'+((props.day+1)<10?'0'+(props.day+1):(props.day+1))+'';
     }

     var data=[]  
    
     db.transaction(
            tx => {
              var qr='select * from D03 where D0304="'+date0+'"';          
              tx.executeSql(qr, [], async (trans, result) => {              
                var data1=await result.rows._array.map(e=>{                
                 return {index:e.D0300,mong:e.D0302,eng:e.D0301,type:e.D0303,pron:e.D0305,day:props.day-1}}) 
                 db.transaction(
                  tx => {
                    var qr='select * from D03 where D0304="'+date+'"';          
                    tx.executeSql(qr, [], async (trans, result) => { 
                      var data2=await result.rows._array.map(e=>{                
                       return {index:e.D0300,mong:e.D0302,eng:e.D0301,type:e.D0303,pron:e.D0305,day:props.day}}) 
                      
                       db.transaction(
                        tx => {
                          var qr='select * from D03 where D0304="'+date2+'"';          
                          tx.executeSql(qr, [], async (trans, result) => { 
                            var data3=await result.rows._array.map(e=>{                
                             return {index:e.D0300,mong:e.D0302,eng:e.D0301,type:e.D0303,pron:e.D0305,day:props.day+1}}) 
                              data.push(data1)
                              data.push(data2)
                              if(data3.length>0)
                                 data.push(data3)
                              setWords(data)                                               
                              if(rreef!=null) 
                                {rreef.snapToItem (1,false)
                                }
                               setLoading(false)
                               },(tx,res)=>{console.log(res)});            
                                      
                            
                              })
                       
                         },(tx,res)=>{console.log(res)});            
                                
                      
                        })


                   },(tx,res)=>{console.log(res)});            
                          
                
                  })
                 
   }, [props.day,props.month])

   async function playsound(req,i){
    
      if(playing==-1)
      {
            setPlaying(i)
            setLastplayed(i)
             try{
                // const audioMale = new Audio.Sound();
                // await audioMale.loadAsync(Paths[req.eng])
                // await audioMale.playFromPositionAsync();
                // await audioMale.playAsync().then(e=>{
                //   audioMale.unloadAsync();
                // });
                // //audioMale._lastStatusUpdate()
                // //await audioMale.replayAsync();
                // setPlaying(-1)
                // setLastplayed(i)
                
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
   //<Text>{`${props.year}-${props.month<10?'0'+props.month:props.month}-${props.day<10?'0'+props.day:props.day} Цээжлэх үгнүүд`}</Text> 
//    <View style={styles.colheader}>
//    <Text style={[styles.headerwords,{width:'10%'}]}>{' '}</Text>
//    <Text style={[styles.headerwords,{width:'40%'}]}>{'Англи'}</Text>
//    <Text style={[styles.headerwords,{width:'40%'}]}>{'Монгол'}</Text>         
// </View>
 async function  _askForAudioPermission (){
    const response = await Audio.requestPermissionsAsync();  
  };
 
        return (
    <View style={styles.container}>
     <View style={{backgroundColor:"#1cb1ed",width:'86%',height:25,borderRadius:10}}>
        <Text style={{alignSelf:'center',fontFamily:"myfont",fontSize:16,color:'white',textAlign:'center',textAlignVertical:'center'}}>{''+props.year+'-'+(props.month<10?'0'+props.month:props.month)+'-'+(props.day<10?'0'+(props.day):(props.day))+' өдрийн цээжлэх үгс'}</Text>
        </View>
        {words.length>0 && !loading? 
        <Carousel
        ref={(c) => {rreef=c}}
        data={words}
        onSnapToItem={e=>{if(e!=1){props.changeday((e===2?props.day+1:props.day-1),props.month)}}}
        renderItem={(e)=>_renderItem(e.item,e.index)}
        sliderWidth={Dimensions.get('window').width}
        firstItem={1}
        itemWidth={Dimensions.get('window').width}
      
      />:
      <ScrollView>
         <View  style={{width:'100%',height:'auto',justifyContent:'center',marginHorizontal:0,backgroundColor:'transparent',borderRadius:10}}>    
                  <Loader/>
      </View>
     </ScrollView>}
            
        
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
    marginTop:0,
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
