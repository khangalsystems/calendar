
import React,{useState,useRef,useEffect,createRef} from 'react';
import { Dimensions, StyleSheet, Text, View,ScrollView,TouchableOpacity,ActivityIndicator,TouchableWithoutFeedback, ImageBackground} from 'react-native';
import Banner from '../components/banner';
import * as SQLite from 'expo-sqlite'
import Month from '../components/month.js';

import HeaderMain from '../components/headermain';
import Loader from '../components/Loader';
import config from '../config.json'
import { daysInMonth } from '../functions/daysInMonth.js';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getMarks } from '../store/selector';
import { setMarks } from '../store/reducer';
const db=SQLite.openDatabase(config.basename)
export default function Main({route,navigation}) {
  let date=new Date();
  const dispatch=useDispatch()
  const marks=useSelector(getMarks)
  let nowyear=date.getFullYear()-1
  const yeardata= [{
    year:nowyear,
    month:getmonthdata(),
     }]
  function getmonthdata(){
    var arr=[
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
     ]
     arr.forEach(el => {
       var days=[]
      var getTot=daysInMonth(parseInt(el.m),nowyear);
      var fdate = new Date(`${nowyear}-${el.m}-01`).getDay()
      if(fdate==0)
      {
          days=['','','','','','']
      }
      else{
        for(var i=1;i<fdate;i++){
          days.push('');
        }
      }
      for(var i=1;i<=getTot;i++){    //looping through days in month
         days.push(i);
       }
       el.days=days
     });
     return arr
  }
  const [loading,setLoading]=useState(true)
  const [subdata,setSubdata]=useState([])


  useEffect(() => {  
    var nowDate =dayjs();
    navigation.navigate('Month',{month:nowDate.month()+1,year:nowDate.year()-1,day:nowDate.date()})
    firstrefresh();
  },[])
  useEffect(()=>{
     filldata()
  },[marks])
  async function executeSql(sql,d,m,amralt){
      return new Promise((resolve, reject) =>db.transaction(tx => {
       tx.executeSql(sql, [], (_, { rows }) => {
        if(rows.length>0){   
         resolve({day:d,score:rows._array[0].score,amralt:amralt>5?true:false,scorecolor:rows._array[0].scorecolor})
        }
       else 
         resolve({day:d,score:-1,amralt:amralt>5?true:false,scorecolor:''})                             
        })
      }))
    }

  function changemonth(y,m,color){
      var date=new Date();
      //console.log({'color':color,'month':m,'year':y,'day':(m==date.getMonth()+1?date.getDate():1)})
      navigation.navigate('Month',{'color':color,'month':parseInt(m),'year':y,'day':(m==date.getMonth()+1?date.getDate():1)})
  }

  function firstrefresh(){  
    if(subdata.length===0){
     filldata();
    }
  }
  async function filldata(){
      
          var lastdata=[],reduxData={}
          for(const year of yeardata)
          {
              var y=year.year ;
              var monthdata=[];
              var mo=1;
                for(const month of year.month)
                {
                      
                      var days=[]
                      var amralt=0;
                      for(const day of month.days)
                      {
                        amralt++;
                                        var date=`${year.year}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                                        var sql='select * from dayscore2 where date="'+date+'"';  
                                        var dayObject=await executeSql(sql,day,month.m,amralt)                         
                                        days.push(dayObject)
                                        var redob={...dayObject}
                                        if(redob.amralt)
                                        {
                                          redob.selected=true
                                          redob.selectedColor=month.color2
                                          reduxData[date]=redob
                                        }
                                        if(amralt==7) amralt=0;
                                        
                
                      }
                      mo++;
                      monthdata.push({m:month.m,color:month.color,color2:month.color2,days:days})
                }
            lastdata.push({year:y,month:monthdata})
          }
       dispatch(setMarks(reduxData))
       setSubdata(lastdata) 
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
                   {subdata.length===0?
                    <ScrollView>
                      <View style={[styles.monthcontainer,{justifyContent:'center',height:Dimensions.get('window').height-100}]}>
                          
                           <Loader/>
                      </View> 
                    </ScrollView>
                    :
                    <ScrollView height={Dimensions.get('window').height-172}> 
                        <View style={styles.monthcontainer}>
                       
                        {
                            subdata[0].month.map(e=>{
                              return <Month key={e.m} color={e.color} color2={e.color2}   days={e.days} onclick={(y,m)=>changemonth(y,m,e.color)} year={nowyear} month={e.m}/>
                            })
                          }
                          
                          </View> 
                          </ScrollView>
                   } 
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
