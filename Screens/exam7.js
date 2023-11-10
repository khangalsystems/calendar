import { AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import React,{useEffect, useState,useRef} from 'react';
import { StyleSheet, Text,ScrollView, View,TouchableOpacity,ImageBackground, ActivityIndicator,Dimensions,TouchableWithoutFeedback} from 'react-native';
import Dragglist from '../components/draggablelist'
import { Entypo } from '@expo/vector-icons'; 
import Modal from "react-native-modal";
import Header from '../components/header';
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
const width=Dimensions.get('window').width;
export default function Exam7({navigation,route}) {
    const scrollref = useRef(null);
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)
    const [heseg,setHeseg]=useState([])
    const [pos,setPos]=useState(0)
    const [modal,setModal]=useState(false)
    const [left,setLeft]=useState(false)
    const [right,setRight]=useState(true)
  useEffect(() => { 
        var lastres=[]  
        
        db.transaction(
          tx => {
            var qr='select * from D03 where D0304 in ('+route.params.weekdays+')';        
            tx.executeSql(qr, [], (trans, result) => { 
              var td=result.rows._array.map(e=>{                
               return {index:e.D0300,mong:e.D0302,eng:e.D0301,type:e.D0303,pron:e.D0305,fail:0,dragged:false}})
                 td=td.sort(() => Math.random() - 0.5);
                 var heseg=Array.from({length:td.length/8}, (value, key) => key) ;  
                 setHeseg(heseg)              
                  heseg.forEach(el=>{
                        var dat=td.slice(el*8,el*8+8).sort(() => Math.random() - 0.5);
                        var dat2=td.slice(el*8,el*8+8).sort(() => Math.random() - 0.5);
                        lastres.push([dat,dat2]);
                      })             
                  setData(lastres)     
                 },(tx,res)=>{console.log(res)});
               
               })
         
               setLoading(false);                
  },[route.params.type,route.params.day,route.params.month])

  async function checkresult(){
    setLoading(true)
     var fail=0;
     var sdata=[];
     var sdata2=[];
     var dat=data
     for(var j=0;j<dat.length;j++)
     {
      var tdata=dat[j][0]
      var tdata2=dat[j][1]

      for(var i=0;i<tdata.length;i++)
      {
          if(tdata[i].eng!==tdata2[i].eng)
             { 
               tdata[i].fail=-1;tdata2[i].fail=-1;fail++;
             }
        else { 
             tdata[i].fail=1;tdata2[i].fail=1
             } 
             sdata.push(tdata[i])
             sdata2.push(tdata2[i])       
      }
    
     };
     var promises = [];
     var score=fail==0?2:fail<10?1:0;
     var dates=route.params.weekdays.split(',');


 
    await dates.forEach(async (date) => {
    await   db.transaction(async (trx) => {
        await trx.executeSql(
            'delete from dayscore2 where date='+date+''
            ,[]
            ,async (transact,resultset) =>{
              const query = `insert into dayscore2 (date,score,scorecolor) values (${date},${score},'${score===2?'#13d436':score===1?'#27e6e2':'#de480d'}');`;
               await db.transaction(async (trx) => {
                  await trx.executeSql(
                      query
                      ,[]
                      ,(transact,resultset) =>{}
                      ,(transact,err) => console.log('error occured ', err)
                );
              })
          
            } 
            ,(transact,err) => console.log('error occured ', err)
       );
      })
    
          
     });
   
      setTimeout(() => {
        setLoading(false)     
        navigation.navigate('Result7',{'data1':sdata,'data2':sdata2,'fail':fail,'day':route.params.day,'month':route.params.month,checkalert:()=>route.params.checkalert(),'title':`${route.params.firstdate} aac ${route.params.lastdate} ны Шалгалт`})
        route.params.refresh(route.params.day);
      }, 2000);
     
  }
  function changedata1(el,i)
  {
    var dat=data;
    dat[i][0]=el;
    setData(dat)
  }
  function changedata2(el,i)
  {
    var dat=data;
    dat[i][1]=el;
    setData(dat)
  }
  var corref;
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={styles.container}>
      <Header navigation={navigation} url={''} title={`${route.params.firstdate} aac ${route.params.lastdate} ны Шалгалт`} params={{first:false}}/>
     
 
        {data.length<2?<ActivityIndicator size={'large'} color={'#1d79cf'}/>:
        <ScrollView horizontal
        ref={scrollref}
        onScroll={(e)=>setPos(e.nativeEvent.contentOffset.x)}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        decelerationRate="fast"
        pagingEnabled
         >
             {heseg.map(e=>{
               return <Dragglist key={e} day={e} changedata1={(el)=>changedata1(el,e)} changedata2={(el)=>changedata2(el,e)} data={data[e][0]} data2={data[e][1]}/> 
             })}
        </ScrollView>          
          }
          <View style={{width:'94%',marginHorizontal:'3%',height:40,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
              <Entypo name="arrow-long-left"  onPress={()=>scrolleft()} size={40} color={left?"#1d79cf":'#a6a7ab'} />
              <Entypo name="arrow-long-right" onPress={()=>scrollright()} size={40} color={right?"#1d79cf":'#a6a7ab'} />
          </View>
      <Text style={{textAlign:'center',fontFamily:'myfont',color:'#1d79cf',paddingHorizontal:5}}>{'Монгол үгийг зөөж Англи үгийн харалдаа мөрөнд байрлуулна уу'}</Text>
        <View style={{flexDirection:'row',width:'70%',marginTop:10,marginHorizontal:'20%',height:'auto',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>checkresult(corref)}  style={{width:110,height:40,backgroundColor:'#1d79cf',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                {loading?<ActivityIndicator size={'small'} color={'white'}/>:
                    <Text style={{color:'white',fontFamily:'myfont'}}>{'Дуусгах'}</Text>}
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
    </ImageBackground>
  );
  function scrolleft()
  {
     
       var index=pos/width;
      console.log(index)
        if(index!=0)
        {
          if(index===1) setLeft(false)
          setRight(true)
        scrollref.current.scrollTo({x:(width*(index-1))})
        setPos((width*(index+1)))
       }
       else setLeft(false)

    
  }
  function scrollright()
  {
   
       var index=pos/width;
      
        if(index!=2)
        {
          if(index===1) setRight(false)
          setLeft(true)
        scrollref.current.scrollTo({x:(width*(index+1))})
        setPos((width*(index-1)))
       }  else setRight(false)

    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
