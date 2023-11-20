
import React,{useState,useRef,useEffect,createRef} from 'react';
import { Dimensions, StyleSheet, Text, View,ScrollView,TouchableOpacity,ActivityIndicator,TouchableWithoutFeedback, ImageBackground} from 'react-native';
import Banner from '../components/banner.js';
import Month from '../components/month.js';

import HeaderMain from '../components/headermain.js';

import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getRefresh } from '../store/selector.js';
export default function Main({route,navigation}) {
  let date=new Date();
  let nowyear=date.getFullYear()
  const refresh=useSelector(getRefresh);

  useEffect(() => {  
    console.log('main')
    var nowDate =dayjs();
    navigation.navigate('Month',{month:nowDate.month()+1,year:nowDate.year(),day:nowDate.date()})
  },[])

  function changemonth(y,m,color){
      var date=new Date();
      //console.log({'color':color,'month':m,'year':y,'day':(m==date.getMonth()+1?date.getDate():1)})
      navigation.navigate('Month',{'color':color,'month':parseInt(m),'year':y,'day':(m==date.getMonth()+1?date.getDate():1)})
  }

    return (
      <ImageBackground source={require('../assets/back1.png')} imageStyle={{opacity:1}} resizeMode='cover'  style={styles.container} >        
       <HeaderMain navigation={navigation} />  
        <Banner navigation={navigation}/>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'94%',marginHorizontal:'3%',marginTop:5}}>
        <Text style={{color:'#1cb1ed'}}>{'Үнэлгээ :'}</Text>
                      <View style={{flexDirection:'row',width:'30%',marginLeft:20,alignItems:'center'}} >
                          <View style={{width:15,height:15,backgroundColor:'#13d436',borderRadius:2}}/>
                          <Text style={{color:'#13d436'}}>{' Сайн'}</Text>
                      </View>
                      <View style={{flexDirection:'row',width:'30%',alignItems:'center'}} >
                          <View style={{width:15,height:15,backgroundColor:'#27e6e2',borderRadius:2}}/>
                          <Text style={{color:'#27e6e2'}}>{' Дунд '}</Text>
                      </View>
                      <View style={{flexDirection:'row',width:'30%',alignItems:'center'}} >
                          <View style={{width:15,height:15,backgroundColor:'#de480d',borderRadius:2}}/>
                          <Text style={{color:'#de480d'}}>{' Муу'}</Text>
                      </View>
                 </View>
               <View>

                    <ScrollView height={Dimensions.get('window').height-172}> 
                        <View style={styles.monthcontainer}>
                        {
                             [
                                  {m:'01',color:'#91bcf2',color2:'#1529d6',days:[]},
                                  {m:'02',color:'#91bcf2',color2:'#1529d6',days: []},
                                  {m:'03',color:'#ffc4ff',color2:'#a60da6',days:[]},
                                  {m:'04',color:'#ffc4ff',color2:'#a60da6',days:[]},
                                  {m:'05',color:'#ffc4ff',color2:'#a60da6',days:[]},
                                  {m:'06',color:'#a4fca7',color2:'#07a60c',days: []},
                                  {m:'07',color:'#a4fca7',color2:'#07a60c',days: []},
                                  {m:'08',color:'#a4fca7',color2:'#07a60c',days: []},
                                  {m:'09',color:'#f2dc79',color2:'#d6b002',days: []},
                                  {m:'10',color:'#f2dc79',color2:'#d6b002',days: []},
                                  {m:'11',color:'#f2dc79',color2:'#d6b002',days: []},
                                  {m:'12',color:'#91bcf2',color2:'#1529d6',days: []}
                                ].map(e=>{
                              return <Month key={e.m} color={e.color} refresh={refresh} color2={e.color2} onclick={(y,m)=>changemonth(y,m,e.color)} year={nowyear} month={parseInt(e.m)}/>
                            })
                          }
                          
                          </View> 
                    </ScrollView>
                 </View>         
      </ImageBackground>
    );
    
  
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    backgroundColor: 'white',
    alignItems:'center'
  },
  yearcontainer:{
    width:'100%',
    borderBottomWidth:0.5,
    borderBottomColor:'#edeae8'
  },
  year:{
    marginLeft:20,
    fontSize:30,   
    fontWeight:"bold",
    color:'#f79f5c'
  },
  monthcontainer:{
    width:Dimensions.get('window').width,
    height:'auto',
    marginTop:10,
    flexDirection:'row',
    justifyContent:'center',
    flexWrap:'wrap',
  },
  Modal:{
    borderWidth:0.2,
    alignSelf:"center",
    height:400,
    paddingTop:0,
    flexDirection:'column',
    justifyContent:'space-between',
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width:Dimensions.get('window').width-100,
    backgroundColor:'grey',
    position: 'relative'
  },
  modalOverlay: {
    position: 'absolute',
    alignSelf:'center',
    width:Dimensions.get('window').width, 
    height:Dimensions.get('window').height, 
    backgroundColor: 'transparent'
  },
});
