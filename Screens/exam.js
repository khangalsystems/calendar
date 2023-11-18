import { Ionicons } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import Constants from 'expo-constants';
import React,{useEffect, useState,useRef} from 'react';
import { StyleSheet,ScrollView,Text,ImageBackground, View,TouchableOpacity,Image,ActivityIndicator,Dimensions,TouchableWithoutFeedback} from 'react-native';
import Dragglist from '../components/draggablelist'
import Modal from "react-native-modal";

import config from '../config.json'
import { useDispatch, useSelector } from 'react-redux';
import { getMarks } from '../store/selector';
import { setMarks } from '../store/reducer';
const db=SQLite.openDatabase(config.basename)
export default function Exam({navigation,route}) {
    const [data,setData]=useState([])
    const marks=useSelector(getMarks)
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(true)
    const [data2,setData2]=useState([])
    const date=`${route.params.year}-${(String(route.params.month).padStart(2,'0'))}-${(String(route.params.day).padStart(2,'0'))}`
  useEffect(() => {   
      db.transaction(
       tx => {
         tx.executeSql(`select * from word where date='${date}'`
         , [],async (trans, result) => { 
              var tdat=result.rows._array.map( e=>{                
                   return {index:e.id,mong:e.mon,eng:e.eng,type:e.class,pron:e.audio,fail:0,dragged:false
                  }})  
               var tdat2=[...tdat]
               setData(shuffleArray(tdat));            
               setData2(shuffleArray(tdat2));   
              },(tx,res)=>{console.log(res)});
            })
  },[route.params.type,route.params.day,route.params.month])
  useEffect(()=>{
        if(data.length>0 && data2.length>0)
         setLoading(false)  
  },[data2])
  function shuffleArray(array) { 
    for (var i = array.length - 1; i > 0; i--) {  
        var j = Math.floor(Math.random() * (i + 1));        
        var temp = array[i]; 
        array[i] = array[j]; 
        array[j] = temp; 
    } 
         
    return array; 
 } 
  const checkresult=()=>{
    var tdata2=[...data2];
    var fail=0;  
    for(var i=0;i<data.length;i++)
    {
        if(data[i].eng!=tdata2[i].eng)
           { 
             data[i].fail=1;
             tdata2[i].fail=1;
             fail++;
           }
       else { 
            data[i].fail=0;
             tdata2[i].fail=0
           }        
    } 
    var scoreColor=fail==0?'#13d436':fail<4?'#27e6e2':'#de480d'
        db.transaction(trx => {
          let trxQuery = trx.executeSql(
              'delete from dayscore2 where date="'+date+'"'
              ,[]
              ,(transact,resultset) =>{
                const query = `insert into dayscore2 (date,score,scorecolor,year,month,day) values ('${date}',${fail==0?2:fail<4?1:0},'${scoreColor}',${route.params.year},${route.params.month},${route.params.day});`;
                db.transaction(trx => {
                    let trxQuery = trx.executeSql(
                        query
                        ,[]
                        ,(transact,resultset) => {
                          var newMarks={...marks}
                          newMarks[date]={
                             selected:true,
                             selectedColor:scoreColor
                          }
                          dispatch(setMarks(newMarks))
                          navigation.navigate('Result',{data1:data,data2:tdata2,fail:fail,day:route.params.day,month:route.params.month,year:route.params.year})
                        }
                        ,(transact,err) => console.log('error occured ', err)
                  );
                })
              } 
              ,(transact,err) => console.log('error occured ', err)
        );
      })
  }
 const changedata2=(data2)=>setData2(data2)
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={{width:'100%',height:Dimensions.get('window').height}} >
        <View style={[styles.container,{backgroundColor:'transparent'}]}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}  style={{width:50,zIndex:2,top:10,position:'absolute',left:10, marginLeft:2,borderRadius:20,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <Ionicons name="ios-arrow-back" size={34} color="#1d79cf" />
            </TouchableOpacity>    
         
          <Text style={{fontFamily:'myfont',color:'#1d79cf',marginVertical:20,fontSize:15}}>{`${date} Тогтоосон үг шалгах`}</Text>

            {loading?<ActivityIndicator/>:
            <Dragglist data={data}  data2={data2} day={route.params.day}  changedata2={changedata2}/>}
            <Text style={{textAlign:'center',marginTop:30,fontSize:15,fontFamily:'myfont',color:'#1d79cf'}}>{'Монгол үгийг зөөж Англи үгийн харалдаа мөрөнд байрлуулна уу'}</Text>
            <View style={{flexDirection:'row',width:'70%',marginTop:10,marginHorizontal:'20%',height:'auto',justifyContent:'center'}}>
                    <TouchableOpacity onPress={checkresult}  style={{width:150,height:50,backgroundColor:'#7de89a',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                    {loading?<ActivityIndicator size={'small'} color={'grey'}/>:
                        <Text style={{color:'white',fontFamily:'myfont'}}>{'ШАЛГАХ'}</Text>}
                    </TouchableOpacity>
            </View>
    </View>     
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header:{
    marginTop:Platform.OS=='ios'?Constants.statusBarHeight:0,
    justifyContent:'space-between',
    flexDirection:'row',
    width:Dimensions.get('window').width,
    height:60,
    alignItems:'center'
 },
  Modal:{
    alignSelf:"center",
    height:100,
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
