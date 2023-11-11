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
  {m:'01',color:'#1529d6'},
  {m:'02',color:'#1529d6'},
  {m:'03',color:'#ffc4ff'},
  {m:'04',color:'#ffc4ff'},
  {m:'05',color:'#ffc4ff'},
  {m:'06',color:'#07a60c'},
  {m:'07',color:'#07a60c'},
  {m:'08',color:'#07a60c'},
  {m:'09',color:'#c1c414'},
  {m:'10',color:'#c1c414'},
  {m:'11',color:'#c1c414'},
  {m:'12',color:'#1529d6'}
 ]
 const Monthscreen = ({navigation,route}) => {
  let date=dayjs();
  let nowyear=date.year()-1
  const modalwidth=Dimensions.get('window').width-100;
  const [modal,setModal]=useState(false)
  const [loading,setLoading]=useState(true)
  const [loadedmonths,setLoadedmonths]=useState([])
  const [activeDateString,setActiveDateString]=useState(date.format('YYYY-MM-DD'))
  const [currentdate, setCurrentdate] = useState('')
  const [day, setDay] = useState(route.params.day?route.params.day:date.date())
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState(0)
  const [monthfirstday, setMontfirstday] = useState(1)
  const [firstdate, setFirstdate] = useState('')
  const [lastdate, setLastdate] = useState('')
  const [showalert, setShowalert] = useState(false)
  const [remain, setRemain] = useState(0)
  const [middletext,setMiddletext]=useState(' ')
  const [succtoken, setSucctoken] = useState(false)
  const [expired, setExpired] = useState(false)
  const [marks,setMarks]=useState({})
  const [markeddates,setMarkeddates]=useState({})
  function fillmarks(){
     setLoading(true)
     checkalert()
     getmonthdata(route.params.year,route.params.month);
     var date=''+route.params.year+'-'+String(route.params.month).padStart(2,"0")+'-'+String(route.params.day).padStart(2,"0"); 
     setMontfirstday(route.params.day)
     setCurrentdate(date)
     setDay(route.params.day)
     setMonth(route.params.month)
     NewDaySelected(route.params.day,route.params.month)
     //fillVacationDays(route.params.year,route.params.month)
     setYear(route.params.year)
     setLoading(false)
  }
 useEffect(() => {
    fillmarks()
 }, [route.params.year,route.params.month])//route.params.day


  const fillVacationDays=(year,month)=>{
      var days={}
      var color=monthColors.find(a=>a.m==month).color
      var getTot=daysInMonth(parseInt(month),year);
      for(var i=1;i<=getTot;i++){ 
          var fdate = new Date(`${nowyear}-${month}-${i<10?'0'+i:i}`).getDay()   //looping through days in month
          if(fdate==0 || fdate==6)
          {           
              days[`${nowyear}-${String(month).padStart(2,"0")}-${String(i).padStart(2,"0")}`]={selected: true,selectedColor:color,amralt:true  }   
          }  
        }
      return days 
  }
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
  function  NewDaySelected (day,monthvar){
    console.log('day changed:'+day,monthvar)
     var date=route.params.year+'-'+(String(monthvar).padStart(2,'0'))+'-'+(String(day).padStart(2,'0'));
     setCurrentdate(date)
      var oldMarks={...marks}
    oldMarks[date] = {
      selected: true,  
      selectedColor:marks[date] && !marks[date].amralt ?marks[date].selectedColor:'#1cb1ed'           
    };
    setMarkeddates(oldMarks)  
    setDay(day)
    setMonth(monthvar)
  };
  function getmonthdata(year,month){
    setLoading(true)
    const query = `select * from dayscore2 where year=(?) and month=(?)`;
    db.transaction(trx => {
        let trxQuery = trx.executeSql(
             query
            ,[year,month]
            ,(transact,resultset) =>{ 
              let newDaysObject = fillVacationDays(year,month);
              resultset.rows._array.forEach((daydata) => {
                newDaysObject[daydata.date] = {
                  selected: true,
                  selectedColor: daydata.scorecolor,            
                };
              });
              setMarks(newDaysObject);
              setMarkeddates(newDaysObject);
              setLoading(false)
            }
            ,(transact,err) => console.log('error occured ', err)
       );
    })

  }
  const gohome=()=>navigation.goBack()
  const relogin=()=>{
    setShowalert(false);
    navigation.navigate('Barcode',{'closeit':()=>{setShowalert(true)},'succ':()=>{setShowalert(false),setSucctoken(true)} });
  }
  const openmodal=()=>{
    var date=''+route.params.year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day)+'';
    setCurrentdate(date)
    var d = new Date(""+route.params.year+"-"+(month<10?'0'+month:month)+"-"+(day<10?'0'+day:day)+"");
    //var weekday=d.getDay()+1;
    var firstday=(day-1)
    var currmonlastday = new Date(route.params.year, month, 0).getDate();
    var lastday=(day+1)
    if(firstday<=0)
    {
      var LastDayPrevMonth = new Date(route.params.year, month-1, 0).getDate();
      firstday=LastDayPrevMonth-(firstday*-1)

      var mo=month-1;
      if(mo==0)
          setFirstdate(`${route.params.year}-${month<10?'0'+month:month}-${'01'}`)
      else 
      {
          setFirstdate(`${route.params.year}-${mo<10?'0'+mo:mo}-${firstday<10?'0'+firstday:firstday}`)
      }
    }
    else{
      setFirstdate(`${route.params.year}-${month<10?'0'+month:month}-${firstday<10?'0'+firstday:firstday}`)
    }
    
    if(lastday>currmonlastday)
    {
      if((month+1)>12)
      {
         lastday=currmonlastday
         setLastdate(`${route.params.year}-${month<10?'0'+month:month}-${lastday<10?'0'+lastday:lastday}`)
      }
      else{
         var zuruu=lastday-currmonlastday;
         setLastdate(`${route.params.year}-${(month+1)<10?'0'+(month+1):(month+1)}-${zuruu<10?'0'+zuruu:zuruu}`)
      }
    }
    else{
       setLastdate(`${route.params.year}-${month<10?'0'+month:month}-${lastday<10?'0'+lastday:lastday}`)
    }
    
   

    //setLastdate(`${route.params.year}-${month<10?'0'+month:month}-${lastday<10?'0'+lastday:lastday}`)
    setModal(true)
  } 
  const refresh=(dayfr)=>{
    var refres=route.params.refreshmonth;
    refres()
    getmonthdata(route.params.year,route.params.month);
  }
  const navigate1=()=>{
    setModal(false)
    navigation.navigate('Exam',{day:day,month:month,year:route.params.year,refresh:(e)=>refresh(e),checkalert:checkalert})
  }
  const navigateVoice=()=>{
    setModal(false)
    navigation.navigate('Examvoice',{'day':day,'month':month,"year":route.params.year,refresh:(d)=>refresh(d),checkalert:()=>checkalert()})
  }
  const navigate7=()=>{
     var wee='';
     var weekdays=getDates()
     weekdays.forEach(el => {
       wee+='"'+el+'",';
     }); 
     wee = wee.substring(0, wee.length - 1);
    setModal(false)
    navigation.navigate('Exam7',{'day':day,'month':month,"year":route.params.year,'weekdays':wee,'firstdate':firstdate,'lastdate':lastdate,refresh:(d)=>refresh(d),checkalert:()=>checkalert()})
   }
  const getDates=()=>{
    var dateArray = [];
    var currentDate = moment(firstdate);
    var stopDate = moment(lastdate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }
  function renderArrow (direction) {
    if(direction === 'left') {
        return <Ionicons name="ios-arrow-back" size={54} style={{zIndex:2}} color={'#1d79cf'} />
    } else {
        return <Ionicons name="ios-arrow-forward" size={54} color={'#1d79cf'} />
    }
  }
  const onVisibleMonthsChange=e=>{
   
    var selectedMonthData=e[0]
     console.log('month changed:'+selectedMonthData.month)
    setDay(selectedMonthData.day)
    setMonth(selectedMonthData.month)
    setYear(selectedMonthData.year)
    getmonthdata(selectedMonthData.year,selectedMonthData.month)
    NewDaySelected(selectedMonthData.day,selectedMonthData.month)
    // var varmonth=(e[0].month===12 && e[0].year===2020)?12:(e[0].month===1 && e[0].year===2022)?1:e[0].month;
    // var date=route.params.year+'-'+(varmonth<10?'0'+varmonth:varmonth)+'-'+(monthfirstday<10?'0'+monthfirstday:monthfirstday);
    // if(month!=e[0].month)
    //  setLoading(true)   
    // setCurrentdate(date)                      
    // setMonth(varmonth),setDay(monthfirstday);var ob={}
    // var date=route.params.year+'-'+(varmonth<10?'0'+varmonth:varmonth)+'-'+(monthfirstday<10?'0'+monthfirstday:monthfirstday);
    // ob[date] = {
    //   disabled: true,  
    //   disabledbackcolor:marks[date] && !marks[date].amralt ?marks[date].selectedColor:'#1cb1ed'           
    // };
    //  setMarkeddates({...marks,...ob}) 
    //  setTimeout(() => {
    //   setLoading(false)
    //  }, 100);
    
//  }
}
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={{flex:1}}>
       
            <TouchableOpacity onPress={gohome}  style={{width:50,zIndex:2,top:10,position:'absolute',left:10, marginLeft:2,borderRadius:20,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <AntDesign name={"home"}  size={34} color={"#1d79cf"} />
            </TouchableOpacity>    
            <TouchableOpacity onPress={()=>{navigation.openDrawer()}}  style={{width:50,marginLeft:2,borderRadius:20,zIndex:2,top:10,position:'absolute',right:10,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:Platform.OS=='ios'?Constants.statusBarHeight-5:0}}>
               <Entypo name="menu" size={40} color="#1d79cf" />
            </TouchableOpacity>         
         
       <View  style={styles.container}>
          {loading?<View style={{height:'auto',justifyContent:'center',alignItems:'center'}}><ActivityIndicator size={'large'} color={'#8be9f0'}/></View>:
                <CalendarList
                      hideArrows={false}
                      markedDates={markeddates}                           
                      minDate={route.params.year+'-01-01'}
                      maxDate={route.params.year+'-12-31'}
                      current={currentdate}    
                      style={{height:345}}
                      renderArrow={(e)=>renderArrow(e)} 
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
                      onVisibleMonthsChange={onVisibleMonthsChange}              
                      pagingEnabled
                      onDayPress={(e)=>{NewDaySelected(e.day,e.month)}}
               />
           }
       </View>
      
       <Words year={year} month={month} day={day} changeday={(d,m)=>NewDaySelected(d,m)}/>
       
       <TouchableOpacity onPress={openmodal} style={{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2,width:80,height:80,borderRadius:50,backgroundColor:'#1cb1ed',bottom:10,right:10}}>
          <Text style={{textAlign:'center',flexWrap:'wrap',color:'white'}}>{'Шалгалт өгөх'}</Text>
       </TouchableOpacity>

                     <Modal visible={modal}>
                          <TouchableWithoutFeedback onPress={()=>setModal(false)}>
                              <View style={styles.modalOverlay} />
                          </TouchableWithoutFeedback>  
                          
                          <View style={styles.Modal}>
                            <Text style={{color:'#1d79cf',marginTop:10,fontFamily:'myfont',fontSize:16}}>{'Тогтоосон үг бататгах'}</Text>
                            <TouchableOpacity onPress={()=>navigate1()} style={{marginVertical:5,width:'80%',height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',padding:10}}>{'1 өдрийн үгээр шалгах \n'+currentdate}</Text>      

                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>navigateVoice()} style={{marginVertical:5,width:'80%',height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',height:'auto',padding:10}}>{'Сонсголоор  шалгалт өгөх \n '+currentdate+''}</Text>      

                            </TouchableOpacity>   
                            <TouchableOpacity onPress={()=>navigate7()} style={{width:'90%',marginTop:5,height:60,backgroundColor:'#1d79cf',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',flexWrap:'wrap',color:'white',height:'auto',padding:10}}>{'3 өдрийн үгээр шалгах \n ('+firstdate+' -c '+lastdate+')'}</Text>      

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