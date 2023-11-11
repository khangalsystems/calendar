import { Ionicons } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import Constants from 'expo-constants';
import React,{useEffect, useState,useRef} from 'react';
import { StyleSheet,ScrollView,Text,ImageBackground, View,TouchableOpacity,Image,ActivityIndicator,Dimensions,TouchableWithoutFeedback} from 'react-native';
import Dragglist from '../components/draggablelist'
import Modal from "react-native-modal";

import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Exam({navigation,route}) {
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)
    const [data2,setData2]=useState([])
    const [modal,setModal]=useState(false)
    const [firstday,setFirstday]=useState(0)

  useEffect(() => {   
      var date=''+route.params.year+'-'+(String(route.params.month).padStart(2,'0'))+'-'+(String(route.params.day).padStart(2,'0'));
      db.transaction(
       tx => {
         var qr='select * from D03 where D0304="'+date+'"';          
         tx.executeSql(qr, [],async (trans, result) => { 
           var tdat=result.rows._array.map( e=>{                
                   return {index:e.D0300,mong:e.D0302,eng:e.D0301,type:e.D0303,pron:e.D0305,fail:0,dragged:false
                  }})  
            var tdat2=[...tdat]
               setData(shuffleArray(tdat));            
               setData2(shuffleArray(tdat2));      
              },(tx,res)=>{console.log(res)});
            
            })
     setFirstday(route.params.day)
     setLoading(false);
  },[route.params.type,route.params.day,route.params.month])
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
    var tdata=[...data];
    var tdata2=[...data2];
    var fail=0;  
    for(var i=0;i<tdata.length;i++)
    {
        if(tdata[i].eng!=tdata2[i].eng)
           { 
             tdata[i].fail=-1;
             tdata2[i].fail=-1;
             fail++;
           }
       else { 
             tdata[i].fail=1;
             tdata2[i].fail=1
           }        
    } 
    console.log(tdata)
    var date2=`${route.params.year}-${route.params.month<10?'0'+route.params.month:route.params.month}-${route.params.day<10?'0'+route.params.day:route.params.day}`;


    db.transaction(trx => {
      let trxQuery = trx.executeSql(
          'delete from dayscore2 where date="'+date2+'"'
          ,[]
          ,(transact,resultset) =>{
            const query = `insert into dayscore2 (date,score,scorecolor,year,month,day) values ('${date2}',${fail==0?2:fail<4?1:0},'${fail==0?'#13d436':fail<4?'#27e6e2':'#de480d'}',${route.params.year},${route.params.month},${route.params.day});`;
            db.transaction(trx => {
                let trxQuery = trx.executeSql(
                     query
                    ,[]
                    ,(transact,resultset) => {
                      route.params.refresh(route.params.day);
                      navigation.navigate('Result',{data1:tdata,data2:tdata2,fail:fail,day:route.params.day,month:route.params.month,year:route.params.year,checkalert:()=>route.params.checkalert()})
                    }
                    ,(transact,err) => console.log('error occured ', err)
               );
            })
          } 
          ,(transact,err) => console.log('error occured ', err)
    );
   })
  }
  const changedata1=(data1)=>setData(data1)
  const changedata2=(data2)=>setData2(data2) 
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={{width:'100%',height:Dimensions.get('window').height}} >
        <View style={[styles.container,{backgroundColor:'transparent'}]}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}  style={{width:50,zIndex:2,top:10,position:'absolute',left:10, marginLeft:2,borderRadius:20,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <Ionicons name="ios-arrow-back" size={34} color="#1d79cf" />
            </TouchableOpacity>    
         
      <Text style={{fontFamily:'myfont',color:'#1d79cf',marginTop:20,fontSize:15}}>{`${route.params.year}-${route.params.month<10?'0'+route.params.month:route.params.month}-${firstday<10?'0'+firstday:firstday} Тогтоосон үг шалгах`}</Text>
      <View style={{flexDirection:'row',width:'100%',height:'auto'}}>
        <Text>

        </Text>
     </View>
        {data2.length===0?null:
          <Dragglist  data={data} data2={data2} day={route.params.day} changedata1={changedata1} changedata2={changedata2}/>}
        <Text style={{textAlign:'center',fontSize:15,fontFamily:'myfont',color:'#1d79cf'}}>{'Монгол үгийг зөөж Англи үгийн харалдаа мөрөнд байрлуулна уу'}</Text>
        <View style={{flexDirection:'row',width:'70%',marginTop:10,marginHorizontal:'20%',height:'auto',justifyContent:'center'}}>
                <TouchableOpacity onPress={checkresult}  style={{width:150,height:50,backgroundColor:'#7de89a',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                {loading?<ActivityIndicator size={'small'} color={'grey'}/>:
                    <Text style={{color:'white',fontFamily:'myfont'}}>{'ШАЛГАХ'}</Text>}
                </TouchableOpacity>
        </View>

             <Modal visible={modal}>
                <TouchableWithoutFeedback onPress={()=>setModal(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>  
                <View style={styles.Modal}>
                    <ActivityIndicator size={'large'} color={'grey'}/>                    
                 </View>
            </Modal>
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
