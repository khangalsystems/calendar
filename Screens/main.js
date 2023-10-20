
import React,{useState,useRef,useEffect,createRef} from 'react';
import { Dimensions, StyleSheet, Text, View,ScrollView,TouchableOpacity,ActivityIndicator,TouchableWithoutFeedback, ImageBackground} from 'react-native';
import Banner from '../components/banner';
import * as SQLite from 'expo-sqlite'
import Month from '../components/month.js';

import HeaderMain from '../components/headermain';
import { CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader';
import AllService from '../services/allservice';
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Main({route,navigation}) {
  let service = new AllService();
  let date=new Date();
  let nowyear=date.getFullYear()
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
  function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}
  useEffect(() => {  
   

    var d = new Date();
    var month = d.getMonth() + 1; 
    var year=d.getFullYear();
   
    var day = d.getDate();
     
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
           { 
             name: 'Home',
           } 
                  
        ],
      })
    );
      if(route.params.id && route.params.id!=0)
      {
        navigation.navigate('News',{screen:'News',params:{id:route.params.id}})
      
      }
       else
       {
      
      navigation.navigate('Month',{'month':month,'year':year,'day':day,refreshmonth:()=>refreshmonth()})
       }
     
      firstrefresh();
    
  },[])
  
  
  
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
      navigation.navigate('Month',{'color':color,'month':parseInt(m),'year':y,'day':(m==date.getMonth()+1?date.getDate():1),'refreshmonth':()=>refreshmonth()})
  }
  function refreshmonth(){
      async function filldata(){
       
    
    var lastdata=[]
    for await(const year of yeardata)
    {
    var y=year.year ;
    var monthdata=[];
    var mo=1;
    for await(const month of year.month)
    {
          
          var days=[]
          var amralt=0;
          for await(const day of month.days)
          {
            amralt++;
                            var date=`${year.year}-${mo<10?'0'+mo:mo}-${day<10?'0'+day:day}`;
                            var sql='select * from dayscore2 where date="'+date+'"';                    
                            days.push(await executeSql(sql,day,month.m,amralt))
                            if(amralt==7) amralt=0;
                            
    
          }
          mo++;
          monthdata.push({m:month.m,color:month.color,color2:month.color2,days:days})
    }
      lastdata.push({year:y,month:monthdata})
    }
    setSubdata(lastdata) 
      }
   filldata();
  }
  function firstrefresh(){  
    if(subdata.length===0){
    async function filldata(){
      
  var lastdata=[]
  for await(const year of yeardata)
  {
  var y=year.year ;
  var monthdata=[];
  var mo=1;
  for await(const month of year.month)
  {
        
        var days=[]
        var amralt=0;
        for await(const day of month.days)
        {
          amralt++;
                          var date=`${year.year}-${mo<10?'0'+mo:mo}-${day<10?'0'+day:day}`;
                          var sql='select * from dayscore2 where date="'+date+'"';  
                                            
                          days.push(await executeSql(sql,day,month.m,amralt))
                          if(amralt==7) amralt=0;
                          
  
        }
        mo++;
        monthdata.push({m:month.m,color:month.color,color2:month.color2,days:days})
  }
    lastdata.push({year:y,month:monthdata})
  }
  setSubdata(lastdata) 
    }
     filldata();
     setLoading(false)
    }
    else{
      // if(alwaysalert)
      //   setShowalert(true)
    }
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
