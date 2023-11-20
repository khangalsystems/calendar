import { AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import React,{useEffect, useState,useRef} from 'react';
import { StyleSheet, Text,ScrollView, View,TouchableOpacity,ImageBackground, ActivityIndicator,Dimensions,TouchableWithoutFeedback} from 'react-native';
import Dragglist from '../components/draggablelist'
import { Entypo } from '@expo/vector-icons'; 
import Modal from "react-native-modal";
import Header from '../components/header';
import config from '../config.json'
import dayjs from 'dayjs';
const db=SQLite.openDatabase(config.basename)
const width=Dimensions.get('window').width;
const screen_height=Dimensions.get('window').height;
const list_item=screen_height>690?60:50
export default function Exam7({navigation,route}) {
    const scrollref = useRef(null);
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)
    const [pos,setPos]=useState(0)
    const [left,setLeft]=useState(false)
    const [right,setRight]=useState(true)
    const [title,setTitle]=useState('')
  useEffect(() => { 
        var lastres=[]
        var date=dayjs(route.params.date)  
        var prevDate=date.add(-1,'day')
        var nextDate=date.add(1,'day')
         setTitle(`${prevDate.format('YYYY-MM-DD')}-с ${nextDate.format('YYYY-MM-DD')} ны шалгалт`)
        db.transaction(
          tx => {
            var qr=`select * from word where date in ('${prevDate.format('YYYY-MM-DD')}','${date.format('YYYY-MM-DD')}','${nextDate.format('YYYY-MM-DD')}')`;   
            tx.executeSql(qr, [], (trans, result) => { 
               var td=result.rows._array.map(e=>{                
               return {index:e.id,mong:e.mon,eng:e.eng,type:e.class,pron:e.audio,fail:0,dragged:false}})
                  td=td.sort(() => Math.random() - 0.5);
                  lastres=[0,1,2].map(el=>{
                          var dat=td.slice(el*8,el*8+8).sort(() => Math.random() - 0.5);
                          var dat2=td.slice(el*8,el*8+8).sort(() => Math.random() - 0.5);
                          return [dat,dat2];
                        })  
                   setData(lastres)     
                 },(tx,res)=>{console.log(res)});
               })

               setLoading(false); 

  },[route.params.type,route.params.date])

  const checkresult=()=>{
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
               tdata[i].fail=1;
               tdata2[i].fail=1;
               fail++;
             }
        else { 
              tdata[i].fail=0;
              tdata2[i].fail=0
             } 
             sdata.push(tdata[i])
             sdata2.push(tdata2[i])       
      }
    
     };
     var score=fail==0?2:fail<10?1:0;
     var scoreColor=score===2?'#13d436':score===1?'#27e6e2':'#de480d'

        var date=dayjs(route.params.date)  
        var prevDate=date.add(-1,'day')
        var nextDate=date.add(1,'day')
        var dates=[prevDate.format('YYYY-MM-DD'),date.format('YYYY-MM-DD'),nextDate.format('YYYY-MM-DD')]
    dates.forEach(async (date) => {
       var curDate=dayjs(date)
       db.transaction(async (trx) => {
         trx.executeSql(
            `delete from dayscore2 where date=${date}`
            ,[]
            ,async (transact,resultset) =>{
              const query = `insert into dayscore2 (date,score,scorecolor,year,month,day) values ('${date}',${score},'${scoreColor}',${curDate.year()},${curDate.month()+1},${curDate.date()});`;
              db.transaction(async (trx) => {
                   trx.executeSql(
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
        navigation.navigate('Result7',{'data1':sdata,'data2':sdata2,'fail':fail,'date':route.params.date,'title':title})
      }, 2000);
     
  }

  function changedata2(el,i)
  {
    var dat=[...data];
    dat[i][1]=el;
    setData(dat)
  }
  useEffect(()=>{
        var index=pos/width;
        console.log(index)
        if(index==0)
           setLeft(false)
        else {
          setLeft(true);setRight(true)
          if(index==2)
            setRight(false)
           else  {setLeft(true);setRight(true)}
        }
        
        
  },[pos])
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch' style={styles.container}>
            <Header navigation={navigation} url={''} title={title} params={{first:false}}/>

                {data.length<2?<ActivityIndicator size={'large'} color={'#1d79cf'}/>:
                    <ScrollView 
                      horizontal
                      ref={scrollref}
                      onScroll={(e)=>{setPos(e.nativeEvent.contentOffset.x)}}
                      showsHorizontalScrollIndicator={false}
                      scrollEventThrottle={200}
                      decelerationRate="fast"
                      pagingEnabled
                      >
                          {[0,1,2].map(e=>{
                            return <View style={{width:width,height:list_item*8+20}}>
                                    <Dragglist key={e} changedata2={(el)=>changedata2(el,e)} data={data[e][0]} data2={data[e][1]}/> 
                                  </View>
                          })}
                    </ScrollView>          
                  }
              <View style={{width:'100%',alignSelf:'center',height:40,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                  <Entypo name="arrow-long-left" style={{marginLeft:20}} onPress={scrolleft} size={45} color={left?"#1d79cf":'#a6a7ab'} />
                  <Entypo name="arrow-long-right" style={{marginRight:20}} onPress={scrollright} size={45} color={right?"#1d79cf":'#a6a7ab'} />
              </View>
             <Text style={{textAlign:'center',alignSelf:'center',fontFamily:'myfont',color:'#1d79cf',paddingHorizontal:5}}>{'Монгол үгийг зөөж Англи үгийн харалдаа мөрөнд байрлуулна уу'}</Text>
             <TouchableOpacity onPress={checkresult}  style={{marginVertical:30,width:110,height:40,alignSelf:'center',backgroundColor:'#1d79cf',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                    {loading?<ActivityIndicator size={'small'} color={'white'}/>:
                        <Text style={{color:'white',fontFamily:'myfont'}}>{'Дуусгах'}</Text>}
              </TouchableOpacity>         
    </ImageBackground>
  );
  function scrolleft()
  {
        var index=pos/width;
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
    flex:1,
    backgroundColor: '#fff',
    alignItems:'flex-start',
    justifyContent:'flex-start'
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
