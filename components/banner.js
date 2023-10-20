import React,{useState,useEffect} from 'react';
import { Image, StyleSheet, Text, View,ImageBackground, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite'
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Banner(props) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getinfo()
    
    return () => {
       
    }
  }, [])
  async function getinfo(){
    const query = `select * from medee order by newsid desc`;
    db.transaction(trx => {
        let trxQuery = trx.executeSql(
             query
            ,[]
            ,(transact,resultset) =>{ 
             
              if(resultset.rows._array.length>0)
              {
                setData(resultset.rows._array[0])
                setLoading(false)
              }
            }
            ,(transact,err) => console.log('error occured ', err)
       );
    })
    
    
  }
  if(loading)
  return(
    <View >
      
    </View>
  )
  else
  return (
    <TouchableOpacity onPress={()=>props.navigation.navigate('News',{screen:'News',params:{"id":data.newsid}})} style={{width:Dimensions.get('window').width}}>
      {data.topimage==''?
       <ImageBackground source={require('../assets/back2.png')} resizeMode='stretch'  style={styles.container} imageStyle={{opacity: 0.7}}>
           <Text style={{width:'95%',textAlign:'center',padding:5,color:'white',fontFamily:'myfont',flexWrap:'wrap'}}>{data.title}</Text>
       </ImageBackground>
       : <ImageBackground source={{uri:data.topimage}} resizeMode='stretch'  style={styles.container} imageStyle={{opacity: 0.5}}>
          <Text style={{width:'95%',textAlign:'center',padding:5,color:'white',fontFamily:'myfont',flexWrap:'wrap'}}>{data.title}</Text>
      </ImageBackground>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height:60,
    flexDirection:'row',
    justifyContent:'center',
    width:'100%',
    alignItems:'center',
    backgroundColor:'grey'
  },
  
 
});
