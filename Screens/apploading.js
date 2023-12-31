import React,{useEffect,useState} from 'react';
import {
  Dimensions,
  StatusBar,
  View,
  Alert,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import AllService from '../services/allservice';
import config from '../config.json'
import Modal from "react-native-modal";
import { execQuery } from '../functions/execQuery';
import dayjs from 'dayjs';
const db=SQLite.openDatabase(config.basename)
export default function Prefering(props) {
  
  const  midtext= useState('SmartCalendar апп-ийн шинэчлэлт хийгдэж байна түр хүлээнэ үү')
  const [updating, setUpdating] = useState(false)
  useEffect(() => {
    _bootstrapAsync()
  }, [])
  
  
  async function _bootstrapAsync(){
    console.log('apploading.22.')
  db.transaction(tx=>{
    db.transaction(tx=>{
      tx.executeSql('select * from info',
        [],
        (tx,result)=>{
           var len=result.rows._array.length
            console.log(len)
              if(len==0)
              {
                    props.navigation.navigate('Login')
                    return 0
              }
              else 
              {
                console.log('checking base..')
                checkbase(); 
                return  0;
              }
          },
        (tx,err)=>console.log(err)
      )
    },
    (err)=>{console.log('err')},
    (succ)=>{console.log('succ')}
  )
           
  })}
  async function checkbase()
           {
            var d = new Date();
            var month = d.getMonth() + 1; 
            var year = d.getFullYear();
            const query11 = `select * from D03 limit 5`;
            db.transaction(tx => {
                  tx.executeSql(
                      query11
                      ,[]
                      ,(transact,resultset) =>{
                         if(resultset.rows._array.length<4){
                                 setUpdating(true)
                                 update() 
                         }
                         else
                         {
                                 savingNews();
                         }
                       },
                       (tx,error)=>{console.log(error)}
                  )})
              
  }
  async function savingNews(data)
  {
    let service = new AllService();
    var token=''
    if(data!=null)
    {
      token = data.token;
    }
    const query = `select * from medee order by newsid desc`;
    db.transaction(trx => {
          trx.executeSql(
              query
              ,[]
              ,(transact,resultset) =>{ 
                 var lastindex=0;
                 if(resultset.rows._array.length>0)
                 {
                   lastindex=resultset.rows._array[0].newsid
                 }               
                  service.Getreklams(token,lastindex).then(result=>result.json())
                   .then(result=>{              
                    var allnews=result.map(news=>{
                              if(news.topimage!='')
                              {    
                                  var imagename=news.topimage.split('/');
                                  imagename=imagename[imagename.length-1]
                                  const downloadResumable = FileSystem.createDownloadResumable(
                                    news.topimage,
                                    FileSystem.documentDirectory + imagename,
                                    {},
                                    (downloadProgress )=>{}
                                  );
                                  try {
                                    downloadResumable.downloadAsync();           
                                  } catch (e) {
                                    console.error(e);
                                  }
                                  news.topimage=FileSystem.documentDirectory + imagename;
                                  return(news);
                              }
                              else
                                return (news);
                       })
                       Promise.all(allnews).then(async function(results) {
                
                            var bar=new Promise((resolve,reject)=>{
                              resolve(results.forEach(item => {
                                const query = `insert into medee(title,newstext,topimage,date,videourl,newsid) values ('${item.title}','${item.newstext}','${item.topimage}','${item.date}','${item.videourl}',${item.index});`;
                                db.transaction(trx => {
                                    let trxQuery = trx.executeSql(
                                         query
                                        ,[]
                                        ,(transact,resultset) => console.log(resultset)
                                        ,(transact,err) => console.log('error occured ', err)
                                   );
                                })
                               }));
                            })
                            bar.then(()=>{
                              props.navigation.navigate('Home',{screen:'Main'})
                            }) 
                           
                       }) 
                     }).catch(e=>{console.log(e),props.navigation.navigate('Home',{screen:'Main'})})                
              }
              ,(transact,err) => console.log('error occured ', err)
        );
      },(err)=>{console.log('err')},(succ)=>console.log('succ'))
      const query2 = `select * from companyinfo2`;
     db.transaction(trx => {
            trx.executeSql(
                query2
                ,[]
                ,(transact,resultset) =>{    
                
                   service.GetAbout().then(result=>result.json()).then(async result=>{
              
                     if(result.updateognoo!=resultset.rows._array[0].date){
                
                          try {
                            db.transaction(trx => {

                                let trxQuery = trx.executeSql(
                                    'delete from companyinfo2'
                                    ,[]
                                    ,(transact,resultset) => {
                                            const query3 = `insert into companyinfo2(mail,facebookurl,address,about,trialtext,phone,date) values ('${result.mail}','${result.facebookurl}','${result.address}','${result.about}','${result.trialText}','${result.phone}','${result.updateognoo}');`;
                                            db.transaction(trx => {
                                            
                                                let trxQuery = trx.executeSql(
                                                    query3
                                                    ,[]
                                                    ,(transact,resultset) => console.log(resultset)
                                                    ,(transact,err) => console.log('error occured ', err)
                                              );
                                            })
                                    }
                                    ,(transact,err) => console.log('error occured ', err)
                              );
                            })
                           
                          } catch (error)
                            {
                              console.log("about err:"+error)
                            }
                        }
                  }).catch(err=>{console.log('about err2'+err)})
                }
            )})
        //service.SaveAppStart(data.userid,Appjson.expo.version).then(result=>result.json()).then(res=>console.log('saved ++'+res)).catch(()=>{console.log('no internet')})
  }
  async function update(){
    console.log('updateing')
    let service = new AllService();
    const result=await service.GetAbout().then(result=>result.json())
    const query = `insert into companyinfo2(mail,facebookurl,address,about,trialtext,phone,date) values ('${result.mail}','${result.facebookurl}','${result.address}','${result.about}','${result.trialText}','${result.phone}','${result.updateognoo}');`;
    db.transaction(trx => {
          execQuery(trx,query).then(async e=>{
                const result=await service.GetCalendarWords(0).then(result=>result.json())
                result.forEach(async el => {
                                var query="INSERT INTO D03(D0300,D0301,D0302,D0303,D0304,D0305,D0306,D0307) VALUES ((?),(?),(?),(?),(?),(?),(?),(?))";
                                db.transaction(async (tx)=>{
                                  tx.executeSql(query,[el.index,el.engword,el.monword,el.wordclass,el.date,el.audio,'',el.tp],(tx,result)=>{                                       
                                  },(tx,result)=>{
                                })
                            })                          
                }); 
          })
    },(err)=>console.log("err tx:"+err))
    db.transaction((tx)=>{
                          service.Getreklams(0,0).then(result=>result.json())
                          .then(result=>{              
                            var allnews=result.map(news=>{
                                      if(news.topimage!='')
                                      {    
                                          var imagename=news.topimage.split('/');
                                          imagename=imagename[imagename.length-1]
                                          const downloadResumable = FileSystem.createDownloadResumable(
                                            news.topimage,
                                            FileSystem.documentDirectory + imagename,
                                            {},
                                            (downloadProgress )=>{}
                                          );
                                          try {
                                            downloadResumable.downloadAsync();           
                                          } catch (e) {
                                            console.error(e);
                                          }
                                          news.topimage=FileSystem.documentDirectory + imagename;
                                          return(news);
                                      }
                                      else
                                        return (news);
                              })
                              Promise.all(allnews).then(async function(results) {
                                    results.forEach(item => {
                                    const query = `insert into medee(title,newstext,topimage,date,videourl,newsid) values ('${item.title}','${item.newstext}','${item.topimage}','${item.date}','${item.videourl}',${item.index});`;
                                    db.transaction(trx => {
                                        let trxQuery = trx.executeSql(
                                            query
                                            ,[]
                                            ,(transact,resultset) => {
                                                 var date=dayjs()
                                                 props.navigation.navigate('Home',{screen:'Monthscreen'})
                                            }
                                            ,(transact,err) => console.log('error occured ', err)
                                      );
                                    })
                                  });
      
                              }) 
                            }).catch(e=>{
                              props.navigation.navigate('Home',{screen:'Monthscreen'})
                            })
                      
                      })

  }

    return (
      <View>
        <ImageBackground source={require('../assets/modalimage.png')} imageStyle={{opacity:updating?0.5:1}} style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>
        
         {updating?
         
                     <Modal visible={updating}>
                           
                           
                           <View style={styles.Modal}>
                                <Text style={{fontFamily:'myfont',textAlign:'center',marginBottom:5,fontSize:16,fontWeight:'bold',color:'#1d79cf'}}>{midtext}</Text>
                                <ActivityIndicator color='#1d79cf' size="small"></ActivityIndicator>
                               
                           </View>
                       </Modal> 
      
         :null}
        
        </ImageBackground>
        <StatusBar barStyle="default" />       
      </View>
    );
  
}
const styles = StyleSheet.create({
  Modal:{
    borderWidth:0.2,
    alignSelf:"center",
    height:100,
    paddingTop:0,
    flexDirection:'column',
    justifyContent:'center',
    paddingBottom: 5,
    alignItems: "center",
    borderRadius:10,
    backgroundColor:'white',
    borderColor: "rgba(0, 0, 0, 0.1)",
    width:Dimensions.get('window').width-100,
    position: 'relative'
  },
  modalOverlay: {
    position: 'absolute',
    alignSelf:'center',
    width:Dimensions.get('window').width, 
    height:Dimensions.get('window').height, 
    backgroundColor: 'transparent'
  },
})