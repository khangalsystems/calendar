import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, ImageBackground, View,Dimensions} from 'react-native';
import Header from '../components/header'
import WebView from 'react-native-webview'
import * as SQLite from 'expo-sqlite'
import config from '../config.json'
const db=SQLite.openDatabase(config.basename)
export default function Aboutus(props) {
  const [data, setData] = useState({about:' '})

  useEffect(() => {
      getinfo()
      return () => {
        
      }
  }, [])
  async function getinfo(){
  
      const query = `select * from companyinfo2`;
      await db.transaction(trx => {
            let trxQuery = trx.executeSql(
                query
                ,[]
                ,(transact,resultset) =>{

                    setData(resultset.rows._array[0])
                 }
            )
        })
  }
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={styles.container}>
          <Header navigation={props.navigation} url={""} params={{}} title={'Календарийн тухай'}/>
          <WebView 
             style={{backgroundColor:'rgba(52, 52, 52, 0.01)',height:'auto',flex:1,width:Dimensions.get('window').width-10,marginHorizontal:5}} 
             source={{html:'<font color="black" size="+7" face="Verdana">'+data.about+'</font>'}} />
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
});
