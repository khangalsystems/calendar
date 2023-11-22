import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import { StyleSheet, Text,Image,View,Dimensions,FlatList, ImageBackground} from 'react-native';
import Header from '../components/header'
import * as SecureStore from 'expo-secure-store';
import AllService from '../services/allservice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite'
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Competition(props) {
  const [data, setData] = useState([])
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
                      
                      setData(resultset.rows._array)
                    }
                    ,(transact,err) => console.log('error occured ', err)
              );
            })
            
            
  }
  function renderitem(e)
  {
    return (
      <TouchableOpacity style={styles.subcontainer} onPress={()=>props.navigation.navigate('OneNews',{'id':e.newsid})} >  
        {e.topimage.length!=''? <Image source={{uri:e.topimage}} style={styles.image} />
              :null
        } 
        

        <View style={styles.textcontainer}>
                        <View style={{ height: 'auto', marginTop: 8 }}>
                            <Text style={styles.title}>{e.title}</Text>
                        </View>
                    
                        <View style={{ flex:1, height:20,marginTop:10}}>
                            <Text style={{ fontSize: 12,color:'black'}}>{e.date}</Text>                         
                        </View>
       </View>
       
      </TouchableOpacity>
    )
  }
  return (
    <ImageBackground source={require('../assets/back1.png')} style={styles.container}>
       <Header navigation={props.navigation} url={""} params={{}} title={'ЗАР , МЭДЭЭ '}/>
       <FlatList
        style={{width:'100%',marginTop:10}}
        data={data}
        renderItem={({item})=>renderitem(item)}
        keyExtractor={item => `${item.newsid}`}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    backgroundColor: '#fff',
    alignItems:'center'
  },
  subcontainer: {
    flex: 1,
    paddingTop:20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 'auto',
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    paddingVertical:5,
    borderBottomWidth:0.3,
    borderBottomColor:'grey',
    backgroundColor: 'white',
   
},
textcontainer: {
  height: 'auto',
  flex:1,
  flexDirection:'column',
  marginHorizontal: '5%',
  marginTop: 0
},
title: {
  fontSize: 14,
  flexWrap: 'wrap'
},
subtitle: {
  fontSize: 12,
  color: 'grey',
  flexWrap: 'wrap', height:'auto'
},
image: {
  width: '30%',
  height: 120,
},
});
