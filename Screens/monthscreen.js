import React, { useState,useRef, useEffect } from 'react';
import Constants from 'expo-constants';
import {View,StyleSheet,Text,TouchableOpacity, Image,TouchableWithoutFeedback, Dimensions, ActivityIndicator,ImageBackground} from 'react-native'
import {CalendarList,LocaleConfig,Calendar} from 'react-native-calendars';
import Words from '../components/words';
import { Ionicons,Entypo,AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite'
import moment from "moment";
import Modal from "react-native-modal";
import WebView from 'react-native-webview'
import * as SecureStore from 'expo-secure-store';
import config from '../config.json'
import { daysInMonth } from '../functions/daysInMonth';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getRefresh } from '../store/selector';

const db=SQLite.openDatabase(config.basename)
LocaleConfig.locales['mn'] = {
  monthNames: ['1 сар','2 сар','3 сар','4 сар','5 сар','6 сар','7 сар','8 сар','9 сар','10 сар','11 сар','12 сар'],
  monthNamesShort: ['1 сар.','2 сар.','3 сар','4 сар','5 сар','6 сар','7 сар.','8 сар','9 сар.','10 сар.','11 сар.','12 сар.'],
  dayNames: ['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'],
  dayNamesShort: ['Ня','Да','Мя','Лх','Пү','Ба','Бя'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'mn';
const monthColors=[
  {m:0,color:'#1529d6'},
  {m:1,color:'#1529d6'},
  {m:2,color:'#1529d6'},
  {m:3,color:'#ffc4ff'},
  {m:4,color:'#ffc4ff'},
  {m:5,color:'#ffc4ff'},
  {m:6,color:'#07a60c'},
  {m:7,color:'#07a60c'},
  {m:8,color:'#07a60c'},
  {m:9,color:'#c1c414'},
  {m:10,color:'#c1c414'},
  {m:11,color:'#c1c414'},
  {m:12,color:'#1529d6'}
 ]
 const Monthscreen = ({navigation,route}) => {
  let date=dayjs();
  const modalwidth=Dimensions.get('window').width-100;
  const [modal,setModal]=useState(false)
  const refresh=useSelector(getRefresh)
  const [loading,setLoading]=useState(true)
  const [currentdate, setCurrentdate] = useState('')
  const [day, setDay] = useState(route.params.day?route.params.day:date.date())
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState(0)
  const [showalert, setShowalert] = useState(false)
  const [remain, setRemain] = useState(0)
  const [middletext,setMiddletext]=useState(' ')
  const [succtoken, setSucctoken] = useState(false)
  const [expired, setExpired] = useState(false)
  const [minDate,setMinDate] = useState(null)
  const [maxDate,setMaxDate] = useState(null)
  const [marks,setMarks]=useState({})
  async function fillmarks(year,month,day){

     checkalert()
     setDay(day)
     setMonth(month)
     setYear(year)
     var date=''+route.params.year+'-'+String(route.params.month).padStart(2,"0")+'-'+String(route.params.day).padStart(2,"0"); 
     var jsDate=dayjs(date)
     setMinDate(jsDate.startOf('month').format('YYYY-MM-DD'))
     setMaxDate(jsDate.endOf('month').format('YYYY-MM-DD'))   
     setCurrentdate(date)
                                        var sql=`select * from dayscore2 where month=${jsDate.month()+1}`;  
                                        var storedMarks=await executeSql(sql)
                                        var oldMarks={...marks}
                                         const weekends=getWeekends(jsDate.startOf('month').format('YYYY-MM-DD'))
                                         weekends.map(day=>{
                                              oldMarks[day]={
                                                   selected:true,
                                                   selectedColor:monthColors[jsDate.month()+1].color
                                                }
                                          })
                                          if(storedMarks)
                                          {
                                            
                                            storedMarks.map(rec=>{
                                                oldMarks[rec.date]={
                                                   selected:true,
                                                   selectedColor:rec.scorecolor
                                                }
                                            })
                                           
                                          }  
                                          setMarks(oldMarks)
                                         
     setTimeout(() => {
       setLoading(false)
     }, 500);
  }
  useEffect(()=>{
    fillmarks(route.params.year,route.params.month,route.params.day)
  },[refresh,route.params.month,route.params.day])
  const checkalert=async ()=>
  {
    return
    var d = new Date()
    var end=new Date(d.getFullYear(), d.getMonth(), d.getDate()+16);
    var data=await SecureStore.getItemAsync('info');
    data=JSON.parse(data)
    var endday=Date.parse(data.endtime)
    //console.log(data)
    if(endday<end){
          var today = moment();
          var d = moment(data.endtime);
          setRemain(today.diff(d,'days')*-1);
          if((today.diff(d,'days')*-1)<=0)
              {
                setExpired(true)
              }   
              else  setExpired(false) 

          setShowalert(true)  
          const query = `select * from companyinfo2`;
          db.transaction(trx => {
              let trxQuery = trx.executeSql(
                  query
                  ,[]
                  ,(transact,resultset) =>{                  
              
                    setMiddletext(resultset.rows._array[0].trialtext)
                  }
                  ,(transact,err) => console.log('error occured ', err)
            );
          })
          // let service = new AllService();
          // service.GetModalText().then(result=>result.json()).then(res=>{setMiddletext(res.trialText)})
        } 
        else {setShowalert(false),setSucctoken(true)}
  }
  function NewDaySelected (day,monthvar){
    console.log('day changed:'+day,monthvar)
    var date=route.params.year+'-'+(String(monthvar).padStart(2,'0'))+'-'+(String(day).padStart(2,'0'));
    setCurrentdate(date)
    setDay(day)
    setMonth(monthvar)
  };
  const gohome=()=>navigation.goBack()
  const relogin=()=>{
    setShowalert(false);
    navigation.navigate('Barcode',{'closeit':()=>{setShowalert(true)},'succ':()=>{setShowalert(false),setSucctoken(true)} });
  }
  const openmodal=()=>{
    setModal(true)
  } 
  const navigate1=()=>{
    setModal(false)
    navigation.navigate('Exam',{day:day,month:month,year:year})
  }
  const navigateVoice=()=>{
    setModal(false)
    navigation.navigate('Examvoice',{day:day,month:month,year:year})
  }
  const navigate7=()=>{
    setModal(false)
    navigation.navigate('Exam7',{day:day,month:month,year:year,date:currentdate})
   }
  const renderArrow=(direction)=>{
    if(direction === 'left') {
        return <Ionicons onPress={()=>changeMonth(-1)} name="ios-arrow-back" size={54} style={{zIndex:2}} color={'#1d79cf'} />
    } else {
        return <Ionicons onPress={()=>changeMonth(1)} name="ios-arrow-forward" size={54} color={'#1d79cf'} />
    }
  }
  const changeMonth=async (step)=>{
     setLoading(true)
     console.log('monthChanged!')
     var jsDate=dayjs(currentdate).add(step,'month')
     if(jsDate.year()>year) jsDate=jsDate.add(-1,'year').startOf('year')
     if(jsDate.year()<year) jsDate=jsDate.add(1,'year').endOf('year')

     setDay(jsDate.startOf('month').date())
     setMonth(jsDate.month())
     setMinDate(jsDate.startOf('month').format('YYYY-MM-DD'))
     setMaxDate(jsDate.endOf('month').format('YYYY-MM-DD')) 
     setCurrentdate(jsDate.startOf('month').format('YYYY-MM-DD')) 
                                        //udriin ungu uguh
                                        var sql=`select * from dayscore2 where month=${jsDate.month()+1}`;  
                                        var storedMarks=await executeSql(sql)
                                        var oldMarks={...marks}
                                         const weekends=getWeekends(jsDate.startOf('month').format('YYYY-MM-DD'))
                                         weekends.map(day=>{
                                              oldMarks[day]={
                                                   selected:true,
                                                   selectedColor:monthColors[jsDate.month()+1].color
                                                }
                                          })
                                          if(storedMarks)
                                          {
                                            
                                            storedMarks.map(rec=>{
                                                oldMarks[rec.date]={
                                                   selected:true,
                                                   selectedColor:rec.scorecolor
                                                }
                                            })
                                           
                                          }  
                                          setMarks(oldMarks)
                                         
     setTimeout(() => {
       setLoading(false)
     }, 500);

   // var oldMarks={...storedMarks}
}
 const changeCurrentDate=(e)=>{setCurrentdate(e),console.log(e)}
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={{flex:1}}>
       
            <TouchableOpacity onPress={gohome}  style={{width:50,zIndex:2,top:10,position:'absolute',left:10, marginLeft:2,borderRadius:20,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <AntDesign name={"home"}  size={34} color={"#1d79cf"} />
            </TouchableOpacity>    
            <TouchableOpacity onPress={()=>{navigation.openDrawer()}}  style={{width:50,marginLeft:2,borderRadius:20,zIndex:2,top:10,position:'absolute',right:10,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <Entypo name="menu" size={40} color="#1d79cf" />
            </TouchableOpacity>         
         
       <View  style={styles.container}>
          {loading?<View style={{height:345,width:'100%'}}><ActivityIndicator /></View>:
                <CalendarList
                      hideArrows={false}
                      markedDates={{...marks,[currentdate]:{selected:true,selectedColor:'#1cb1ed'}}}      
                      minDate={minDate}
                      maxDate={maxDate}
                      current={currentdate}    
                      style={{height:345}}
                      
                      renderArrow={renderArrow} 
                      monthFormat={"M сар"} 
                      firstDay={1}
                      horizontal
                    
                      disableLeft={true}
                      theme={{
                        textSectionTitleColor:'#1d79cf',//route.params.color,
                        backgroundColor: 'transparent',
                        calendarBackground:'transparent', 
                        textDayHeaderFontSize:14,
                        todayTextColor:'#5c4e42',
                        todayBackgroundColor:'#cbf7f7',
                        textDayFontFamily:'myfont',
                        textDayHeaderFontFamily:'myfont',
                        monthTextColor:'#1d79cf'//route.params.color,
                      }}             
                      pastScrollRange={10}
                      futureScrollRange={10}
                      //onVisibleMonthsChange={onVisibleMonthsChange}              
                      pagingEnabled
                      onDayPress={(e)=>{NewDaySelected(e.day,e.month)}}
               />
            }
           
       </View>
      
       <Words currentDate={currentdate} changeParentDay={changeCurrentDate}/>
       
       <TouchableOpacity onPress={openmodal} style={{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2,width:80,height:80,borderRadius:50,backgroundColor:'#1cb1ed',bottom:10,right:10}}>
          <Text style={{textAlign:'center',flexWrap:'wrap',color:'white'}}>{'Шалгалт өгөх'}</Text>
       </TouchableOpacity>

                     <Modal visible={modal}>
                          <TouchableWithoutFeedback onPress={()=>setModal(false)}>
                              <View style={styles.modalOverlay} />
                          </TouchableWithoutFeedback>  
                          
                          <View style={styles.Modal}>
                            <Text style={{color:'#1d79cf',marginTop:10,fontFamily:'myfont',fontSize:16}}>{'Тогтоосон үг бататгах'}</Text>
                            <TouchableOpacity onPress={navigate1} style={{marginVertical:5,width:'80%',height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',padding:10}}>{'1 өдрийн үгээр шалгах \n'+currentdate}</Text>      

                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateVoice} style={{marginVertical:5,width:'80%',height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',height:'auto',padding:10}}>{'Сонсголоор  шалгалт өгөх \n '+currentdate+''}</Text>      

                            </TouchableOpacity>   
                            <TouchableOpacity onPress={navigate7} style={{width:'90%',marginTop:5,height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',height:'auto',padding:10}}>{`3 өдрийн үгээр шалгах \n (${getRangeDate()})`}</Text>      

                            </TouchableOpacity>   
                              
                          </View>
                      </Modal>  
                      <Modal visible={showalert}>
                            <TouchableWithoutFeedback onPress={()=>{}}>
                                <View style={styles.modalOverlay} />
                            </TouchableWithoutFeedback>  
                                    
                                     <TouchableOpacity onPress={relogin} style={{marginHorizontal:30,marginBottom:5,width:Dimensions.get('window').width-100,borderRadius:10,height:50,backgroundColor:'#8fc1e3',justifyContent:'center',alignItems:'center'}}>
                                          <Text style={{color:'white',flexWrap:"wrap"}} >{'Идэвхжүүлэх код oруулах'}</Text>
                                      </TouchableOpacity>
                            <ImageBackground source={require('../assets/modalimage.png')} imageStyle={{opacity:0.2}} style={styles.Modal2}>
                                  <View style={{width:'100%',height:300}}>
                                     
                                    
                                    <View style={{width:'100%',color:'white',flex:1,height:'auto'}}>
                                          <WebView     showsHorizontalScrollIndicator={false}
                                                    style={{backgroundColor:'rgba(52, 52, 52, 0.01)',height:320,width:'90%',marginHorizontal:'5%',flexWrap:'wrap'}} 
                                                    source={{html:'<font color="white" size="+7" face="Verdana">'+middletext+'</font>'}} />
                                    </View>
                                  </View>            
                            </ImageBackground>
                              <TouchableOpacity onPress={()=>{if(!expired){setShowalert(false)}}}  style={{marginHorizontal:30,width:modalwidth,marginTop:5,borderRadius:10,height:50,backgroundColor:'#d12c2c',justifyContent:'center',alignItems:'center'}}>
                                          <Text style={{color:'white',flexWrap:"wrap"}} >{expired?'Ашиглах хугацаа дууссан байна!':'Үргэлжлүүлэх ('+remain+' хоног)'}</Text>
                              </TouchableOpacity> 
                        </Modal> 
    </ImageBackground>
  );
  function getRangeDate()
  {
    var  curDate=dayjs(currentdate)
    return `${curDate.add(-1,'day').format('YYYY-MM-DD')}-c ${curDate.add(1,'day').format('YYYY-MM-DD')}`
  }
  async function executeSql(sql){
      return new Promise((resolve, reject) =>db.transaction(tx => {
       tx.executeSql(sql, [], (_, { rows }) => {
        if(rows.length>0){   
          resolve(rows._array)
        }
       else 
          resolve(null)                             
        })
      }))
  }
  function getWeekends(date){
    var d = new Date(date);
    var getTot = daysInMonth(d.getMonth(),d.getFullYear()); //Get total days in a month
    var weekends = new Array();   //Declaring array for inserting Saturdays

    for(var i=1;i<=getTot;i++){    //looping through days in month
        var newDate = new Date(d.getFullYear(),d.getMonth(),i)
        if(newDate.getDay()==0 || newDate.getDay()==6){   //if Sunday
            weekends.push(dayjs(newDate).format('YYYY-MM-DD'));
        }
    }
     return weekends
  }
 

 
};

export default Monthscreen;
const styles = StyleSheet.create({
  header:{
    marginTop:20,
    flexDirection:'row',
    zIndex:2,
    position:'absolute',
    justifyContent:'space-between',
    width:'100%',
    height:60,
    alignItems:'center'
 },
  container: {
    width:'100%',
    backgroundColor:'transparent',
    flexDirection:'column',
    marginTop:20,
  },
  daysheader:{width:'14%',fontSize:12,textAlign:'center'},
  dayscontainer:{
    width:'100%',
    flexDirection:'row',
    flexWrap:'wrap'
  },
  monthheader:{
      flexDirection:'row'
  },
  dayname:{
      marginLeft:5,
      fontSize:7
  },
  Modal:{
    borderWidth:0.2,
    alignSelf:"center",
    height:300,
    paddingTop:0,
    flexDirection:'column',
    justifyContent:'space-between',
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
    backgroundColor:'white',
    borderColor: "rgba(0, 0, 0, 0.1)",
    width:Dimensions.get('window').width-100,
    position: 'relative'
  },
  Modal2:{
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
    backgroundColor:'grey',
    borderColor: "rgba(0, 0, 0, 0.1)",
    width:Dimensions.get('window').width-80,
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