
import React,{useState} from 'react';
import { StyleSheet, Text,ActivityIndicator,View,Dimensions,TouchableOpacity,ImageBackground} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo,FontAwesome5} from '@expo/vector-icons'; 
export default function Result7({navigation,route}) {
  const [loading, setLoading] = useState(false)
      function result(){
        var data1=route.params.data1;
        var data2=route.params.data2;
        var list=[];
        for(var i=0;i<data1.length;i++)
        {
            list.push(<View key={i} style={{flexDirection:'row',width:'100%',backgroundColor:'transparent'}}>
              <View style={[styles.item,{backgroundColor:'transparent',borderWidth:0.3}]}>
                    
                    <Text style={[styles.text,{color:'#1d79cf'}]}>
                      {data2[i].eng}
                    </Text>
                 </View>
               <View style={[styles.item,{backgroundColor:data1[i].fail===1?'green':data1[i].fail===0?'white':'red',flexDirection:'row'}]}>
                      <Text style={[styles.text,{color:'white',width:'80%'}]}>
                      {data1[i].mong}
                    </Text>
                    {data1[i].fail===1?<FontAwesome5  tyle={{width:'20%',alignSelf:'center'}} name="smile" size={24} color="white" />:<Entypo name="emoji-sad" style={{width:'20%',alignSelf:'center'}} size={24} color="black" /> 
 
                         }
                 </View>
          
                 
            </View>)
        }
        return list
      }
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'   style={{flexDirection:'column',width:'100%',height:Dimensions.get('window').height+50,alignItems:'center',backgroundColor:'transparent'}}>
        <Text  style={{fontFamily:'myfont',color:'#1d79cf',marginVertical:20,fontSize:15,flexWrap:'wrap',width:'90%',textAlign:'center'}}>{route.params.title+' ын  хариу'}</Text>
        <View style={{flexDirection:'row',width:Dimensions.get('window').width-30,height:Dimensions.get('window').height-200,backgroundColor:'transparent'}}>
             <ScrollView height={Dimensions.get('window').height-200}>
                 {result()}
             </ScrollView>
        </View>  
        <Text style={{fontFamily:'myfont',marginVertical:20,color:'#1d79cf',fontSize:15,flexWrap:'wrap',width:'90%',textAlign:'center'}}>{'Ta '+route.params.fail+' алдсан байна !'}</Text>   
        <TouchableOpacity onPress={()=>{navigate()}} style={{width:150,height:45,borderRadius:10,backgroundColor:'#7de89a',justifyContent:'center',alignItems:'center'}}>
                         {loading?<ActivityIndicator size={'small'} color={'white'}/>
                         :<Text style={{color:'white'}}>{route.params.month+'-р сар руу Буцах '}</Text>
                         }
            </TouchableOpacity>              
   </ImageBackground>
  );
  function navigate(){
    setLoading(true)
    setTimeout(() => {
      navigation.navigate('Month',{'day':route.params.day,'month':route.params.month}),
      route.params.checkalert()
      setLoading(false)
    }, 1000);
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item:{ height:50,
    width:'50%',
    borderRadius:0,
    alignItems: "center",
    borderBottomWidth:0.5,
    justifyContent: "center"
  },
  text:{fontWeight: "bold",
  color: "black",
  textAlign:'center',
  fontSize: 12,}
});
