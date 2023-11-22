import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,Dimensions} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/header'
import dayjs from 'dayjs';
import { Provinces } from '../data/provinces';
export default function Profile(props) {
  const [data, setData] = useState(null)
  const [time, setTime] = useState('')
  useEffect(() => {
     getinfo()
  },[])
  async function getinfo(){
    var data=await SecureStore.getItemAsync('info');
    var date=await SecureStore.getItemAsync('trailDate');
    var userId=await SecureStore.getItemAsync('userId');
    var code=await SecureStore.getItemAsync('code');

    setTime(dayjs(date).format('YYYY-MM-DD'))
    setData({...JSON.parse(data),userId:userId,code:code})
  }
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} url={""} title={'ХУВИЙН МЭДЭЭЛЭЛ'}/>   
      <View style={{marginTop:20}}/>
      {data && <>
      <LinearGradient style={styles.prostart} start={{x:2,y:2}} colors={['#f7fafa', '#defafa']}>
            <Text style={styles.protitle}>{'Хэрэглэгчийн ID:'}</Text>
            <Text style={styles.proval}>{data.userId}</Text>
      </LinearGradient>
      <LinearGradient style={styles.pro} start={{x:2,y:2}} colors={['#b8eaf2', '#d9fcf5']}>
            <Text style={styles.protitle}>{'Нэр :'}</Text>
            <Text style={styles.proval}>{data.name}</Text>
      </LinearGradient>
      <LinearGradient style={styles.pro} start={{x:2,y:2}} colors={['#f7fafa', '#defafa']}>
            <Text style={styles.protitle}>{'Нас :'}</Text>
            <Text style={styles.proval}>{data.age===1?'6-12 нас':data.age===2?'13-18 нас':'19 дээш нас'}</Text>
      </LinearGradient>
      <LinearGradient style={styles.pro} start={{x:2,y:2}} colors={['#b8eaf2', '#d9fcf5']}>
            <Text style={styles.protitle}>{'Утас  :'}</Text>
            <Text style={styles.proval}>{data.phone}</Text>
      </LinearGradient>
      <LinearGradient style={styles.pro} start={{x:2,y:2}} colors={['#f7fafa', '#defafa']}>
            <Text style={styles.protitle}>{'Байршил :'}</Text>
            <Text style={styles.proval}>{Provinces.find(e=>e.index==data.district).name}</Text>
      </LinearGradient>
      <LinearGradient style={data.token==''?styles.proend:styles.pro} start={{x:2,y:2}}  colors={['#b8eaf2', '#d9fcf5']}>
            <Text style={styles.protitle}>{'Ашиглах хугацаа :'}</Text>
            <Text style={styles.proval}>{time}</Text>
      </LinearGradient>
      {data.token!=''?<LinearGradient style={styles.proend} start={{x:2,y:2}} colors={['#b8eaf2', '#d9fcf5']}>
            <Text style={styles.protitle}>{'Код  :'}</Text>
            <Text style={styles.proval}>{data.code}</Text>
      </LinearGradient>:null}
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:'100%',
    paddingTop:20,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  prostart:{
    width:'80%',marginHorizontal:'10%',flexDirection:'row',justifyContent:'space-between',
    height:50,alignItems:'center',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderColor:'#13dae8',
    borderBottomWidth:0.3
  },
  proend:{
    width:'80%',marginHorizontal:'10%',flexDirection:'row',justifyContent:'space-between',
    height:50,alignItems:'center',
    borderBottomLeftRadius:10,
    borderColor:'#13dae8',
    borderBottomRightRadius:10,
    borderBottomWidth:0.3
  },
  pro:{
    width:'80%',marginHorizontal:'10%',flexDirection:'row',justifyContent:'space-between',
    height:50,alignItems:'center',
    borderColor:'#13dae8',
    borderBottomWidth:0.3
  },
  protitle:{
    fontFamily:'myfont',
    margin:10,
    fontSize:16,
    color:'black'
  },
  proval:{
    margin:10,
    fontSize:16,
    fontWeight:'bold'
  }
});
