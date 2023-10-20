import React,{useState,useEffect} from 'react';
import WebView from 'react-native-webview'
import { StyleSheet,ImageBackground,Text, View,Dimensions,Image,ActivityIndicator} from 'react-native';
import Header from '../components/header'
import config from '../config.json'
import * as SQLite from 'expo-sqlite'
const db=SQLite.openDatabase(config.basename)
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
export default function News({navigation,route}) {

  useEffect(() => {
   console.log(route.params)
    const query = `select * from medee where newsid=`+route.params.id;
    db.transaction(trx => {
        let trxQuery = trx.executeSql(
            query
            ,[]
            ,(transact,resultset) =>{ 
              
              setData(resultset.rows._array[0])
            }
            ,(transact,err) => console.log('error occured ', err)
      );
    })
    

    return () => {
      
    }
  }, [route.params.id])
    const [error, setError] = useState(false)
    const [data, setData] = useState()
    if(data==undefined)
    return (
      <ImageBackground source={require('../assets/back1.png')} style={styles.container}>
              
  
       </ImageBackground>)
       else
  return (
    <ImageBackground source={require('../assets/back1.png')} style={styles.container}>
            <Header navigation={navigation} url={""} params={{}} title={'ДЭЛГЭРЭНГҮЙ'}/>
            <Text style={{textAlign:'center',flexWrap:'wrap',color:'black',fontWeight:'bold',fontSize:18,marginVertical:5}}>{data.title}</Text>
            {data.topimage!=''?<Image source={{uri:data.topimage}} style={{width:'90%',marginHorizontal:'5%',borderRadius:10,height:120}} />
            :null}
            
          
            { data.videourl.length>2?<View style={{borderRadius:30,marginTop:10,height:150,width:Dimensions.get('window').width-40,marginHorizontal:20,}}>
            
             {error?<View  style={[styles.video,{justifyContent:'center',alignItems:'center'}]} ><Text style={{marginRight:10}}>{'Интернэтэд холбогдох боломжгүй байна!'}</Text>
                                      <MaterialCommunityIcons name="reload" onPress={()=>setError(false)} size={24} color="black" />
                                      </View>
               :<WebView    
               onError={()=>setError(true)} 
               allowsFullscreenVideo={true} 
               style={styles.video} 
               source={{ uri: "https://www.youtube.com/embed/" + data.videourl }} />}

                </View>:null}
            <WebView 
             style={{backgroundColor:'rgba(52, 52, 52, 0.01)',height:'auto',flex:1,width:Dimensions.get('window').width-40,marginHorizontal:20}} 
             source={{html:'<font color="black" size="14" face="Verdana">'+data.newstext+'</font>'}} />
    <Text style={{textAlign:'right',flexWrap:'wrap',color:'black',fontWeight:'bold',fontSize:18,marginVertical:5}}>
     {data.date}
     </Text>

   </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    alignItems:'center',
    backgroundColor: '#fff'
  },
  video: {
    height:100,
    borderRadius:10
},
});
