import { StatusBar } from 'expo-status-bar';
import React ,{useState,useEffect} from 'react';
import { ActivityIndicator, Dimensions, StyleSheet,ImageBackground,Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite'
import config from '../config.json'
import { daysInMonth } from '../functions/daysInMonth';
import dayjs from 'dayjs';
const db=SQLite.openDatabase(config.basename)
export default function Month({month,year,color,color2,onclick,refresh}) {
  const [marks,setMarks]=useState(null)
  useEffect(()=>{
          getMonthData()                          
  },[month,refresh])
  const getMonthData=async ()=>{
                                        var date=`${year}-${String(month).padStart(2,"0")}-01`; 
                                        var sql=`select * from dayscore2 where month=${month}`;
                                        var storedMarks=await executeSql(sql)
                                        var oldMarks=[]
                                        const weekends=getWeekends(date)
                                         weekends.map(e=>{
                                              var haveScore=null
                                              if(storedMarks.length>0)
                                              {
                                                haveScore=storedMarks.filter(r=>r.day==e.day)[0]
                                              }
                                             if(!haveScore)
                                                oldMarks.push({
                                                   day:e.day,
                                                   selectedColor:e.color,
                                                   backgroundColor:e.backgroundColor
                                                })
                                             else oldMarks.push({
                                                    day:haveScore.day,
                                                    selectedColor:'#fff',
                                                    backgroundColor:haveScore.scorecolor
                                                 })
                                          })
                                          console.log(oldMarks.length)
                                         setMarks(oldMarks)
 

  }
  async function executeSql(sql){
      return new Promise((resolve, reject) =>db.transaction(tx => {
       tx.executeSql(sql, [], (_, { rows }) => {
        if(rows.length>0){   
          resolve(rows._array)
        }
       else 
          resolve([])                             
        })
      }))
  }
  function getWeekends(date){
    var d = new Date(date);
    var getTot = daysInMonth(d.getMonth(),d.getFullYear()); //Get total days in a month
    var weekends = new Array();   //Declaring array for inserting Saturdays
    var nullDates=d.getDay()==0?6:d.getDay()
    for(var i=1;i<nullDates;i++){    //looping through days in month
              weekends.push({day:'',color:'#fff',backgroundColor:"transparent"});
      }
    for(var i=1;i<=getTot;i++){    //looping through days in month
        var newDate = new Date(d.getFullYear(),d.getMonth(),i)
        if(newDate.getDay()==0 || newDate.getDay()==6){   //if Sunday
            weekends.push({day:newDate.getDate(),color:'#fff',backgroundColor:color});
        }else  weekends.push({day:newDate.getDate(),color:'#000',backgroundColor:"transparent"});
    }
     return weekends
  }
  return (
    <TouchableOpacity onPress={()=>onclick(year,month)} style={styles.container}>
      
        <Text style={{fontWeight:'bold',color:color2}}>{month} сар</Text>
        <View style={styles.dayscontainer}>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Да'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Мя'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Лх'}</Text>
        </View>
        <View style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Пү'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Ба'}</Text>
        </View>
        <View  style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Бя'}</Text>
        </View>
        <View style={{width:'13%',height:13,justifyContent:'center',margin:0.5,marginVertical:0,alignItems:'center'}}>
          <Text  style={{width:'100%',fontSize:8,color:color2,margin:0.5}}>{'Ня'}</Text>
        </View>
       
        </View>
       
        <View style={styles.dayscontainer}>
         {marks&&marks.map((e,i)=>{         
           return <View key={i} style={{width:'13%',height:16,justifyContent:'center',margin:0.5,marginVertical:0.5,backgroundColor:e.backgroundColor,alignItems:'center'}}>
                         <Text     style={{fontSize:8,fontWeight:'normal',color:e.selectedColor}}>{e.day}</Text>
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
