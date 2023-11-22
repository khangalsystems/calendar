import { get } from "../api/request";
import * as SQLite from 'expo-sqlite'
import config from '../api/config'
import dataConfig from '../config.json'
import dayjs from "dayjs";
import * as FileSystem from 'expo-file-system'

const db=SQLite.openDatabase(dataConfig.basename)
export async function downloadNews() {
  //medee(title text,newstext text,topimage text,date text,videourl text,newsid integer);
   const result=await get('/news')
   if(result.data)
   {
     db.transaction((tx)=>{
        tx.executeSql(`delete from medee`)
     })

     const res=await Promise.all(result.data.map(async (data,index)=>{
         return await new Promise((resolve, reject) =>{
                    db.transaction(async (tx)=>{
                                  
                                 if(data.image)
                                 {
                                    var filepath=FileSystem.documentDirectory + data.image;
                                    let tmp = await FileSystem.getInfoAsync(filepath);
                                    console.log(tmp)
                                        if(tmp.exists!=true)
                                        { 
                                            console.log('zurag baigaagui')
                                            const downloadResumable = FileSystem.createDownloadResumable(
                                            config.newsUrl+data.topimage,
                                            filepath,
                                            {},
                                            (downloadProgress )=>{}
                                            );
                                            try {
                                            console.log('zurag tataj baina :'+filepath)
                                            downloadResumable.downloadAsync(); 
                                            data.image=filepath;
                                            console.log(filepath.rui)
                                            } catch (e) {
                                            console.log('zurag aldaa:'+e);
                                            }
                                        }
                                        else{ 
                                            console.log('zurag baisan')
                                            data.image=filepath
                                        }
                                 }
                                  
                        tx.executeSql(`insert into medee values ('${data.title}','${data.text}','${data.image}','${dayjs(data.regDate).format('YYYY-MM-DD')}','${data.videoUrl}',${data.id})`
                        ,[],(tx,result)=>{
                            resolve(1)
                        },err=>{console.log(err);resolve(0)})
                    },err=>{console.log(err);resolve(0)})
                })
     }))
     return 1
   }
   else return null
//   service.GetAbout().then(result=>result.json()).then(async result=>{
//     try {
//       const query = `insert into companyinfo2(mail,facebookurl,address,about,trialtext,phone,date) values ('${result.mail}','${result.facebookurl}','${result.address}','${result.about}','${result.trialText}','${result.phone}','${result.updateognoo}');`;
//       db.transaction(trx => {
//           let trxQuery = trx.executeSql(
//                query
//               ,[]
//               ,(transact,resultset) => console.log(resultset)
//               ,(transact,err) => console.log('error occured ', err)
//          );
//       })
//     } catch (error)
//        {
//          console.log("about err:"+error)
//       }
//   }).catch(err=>{console.log('about err2'+err)})
//     db.transaction(async (tx)=>{
//                                  tx.executeSql('INSERT INTO info(token,phone,name,notifTime,notifTime2,endDay) VALUES ((?),(?),(?),(?),(?),(?))',[barkodstr,phone,name,'11:00','14:00',dayjs().add(13,'days').format('YYYY-MM-DD')],(tx,result)=>{                                       
//                                   },(tx,result)=>{
//                                     console.log(result);
//                                })
//      })
//     savingNews();
//                   db.transaction((tx)=>{
//                        tx.executeSql(`delete from word`,[],(tx,result)=>{ 
//                                   service.GetCalendarWords(barkodstr).then(result=>result.json()).then(result=>{
//                                     var promises = [];
//                                     console.log(result.length)
//                                     console.log(result[0])
//                                     var i=0
//                                     result.forEach(el => {

//                                          //var one=new Promise((resolve,reject) =>{
//                                                   db.transaction(async (tx)=>{
//                                                       tx.executeSql("INSERT INTO word VALUES ((?),(?),(?),(?),(?),(?))"
//                                                       ,[el.index,el.engword,el.monword,el.wordclass,el.date,el.audio],(tx,result)=>{
//                                                                 i++ 
//                                                                 if(i>=2900)
//                                                                 {
//                                                                     //Notifications.cancelAllScheduledNotificationsAsync()          
//                                                                     //setDownloading(false);
//                                                                     //setLoging(false)
//                                                                     //setNotif();
//                                                                     navigation.navigate('Home',{screen:'Main',params:{id:0,page:'Main'}})
//                                                                 }
//                                                       },(tx,result)=>{
//                                                          console.log('error..'+i)
//                                                       })
//                                                   })
                                                  
//                                         })
//                                          // promises.push(one)          
//                                     }); 
//                                     //  Promise.all(promises).then(() =>{
//                                     //         console.log('all words done!')
//                                     //         Notifications.cancelAllScheduledNotificationsAsync()          
//                                     //         setDownloading(false);
//                                     //         setLoging(false)
//                                     //         setNotif();
//                                     //        navigation.navigate('Home',{screen:'Main',params:{id:0,page:'Main'}})
//                                     //  }).catch(err=>{console.log('aldaa all prom');console.log(err)});
//                                   //}).catch(err=>console.log('getting words err'+err))
                        
//                       },(tx,result)=>{
//                     })})   
}