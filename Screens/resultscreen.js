import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity,ImageBackground, FlatList} from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { AntDesign,Entypo,FontAwesome5} from '@expo/vector-icons'; 
const screen_height=Dimensions.get('window').height
const list_item=screen_height>600?60:50
export default function Result({navigation,route}) {
     
     function renderItem( item, index, drag, isActive){
        return (
          <View
            style={{
              height:list_item,
              backgroundColor: item.fail==0?'green':'white',
              borderRadius:0,
              borderBottomWidth:0.5,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center'
              
            }}
          >
            <Text
              style={{
                color: item.fail==0?'white':'red',
                flexWrap:'wrap',
                width:'49%',
                fontFamily:'myfont',
                backgroundColor:'transparent',
                textAlignVertical:'center',
                textAlign:'center',
                fontSize: 15,
              }} 
            >
              {item.mong}
            </Text>
              {item.fail==0?<FontAwesome5  style={{width:'20%',alignSelf:'center'}} name="smile" size={24} color="white" />:<Entypo name="emoji-sad" style={{width:'20%',alignSelf:'center'}} size={24} color="red" /> }
          </View>
        );
      };
      function renderItem2( item, index, drag, isActive){
        return (
          <View
            style={{
              height:list_item,
              backgroundColor: 'white',
              borderRadius:0,
              alignItems: "center",
              borderWidth:0.3,
              flexDirection:'row',
              borderColor:'grey',
              justifyContent:'center'
              
            }}
          >
            <Text
              style={{
                fontFamily:'myfont',
                color: "#1d79cf",
                flexWrap:'wrap',
                width:'50%',
                backgroundColor:'transparent',
                textAlignVertical:'center',
                textAlign:'center',
                fontSize:15,
              }} 
            >
              {item.eng}
            </Text>
          </View>
        );
      };
  const checkAndNavigate=()=>{
    route.params.checkalert()
    navigation.navigate('Month',{day:route.params.day,month:route.params.month,year:route.params.year});
  }
  return (
    <ImageBackground source={require('../assets/back1.png')} resizeMode='stretch'  style={{flexDirection:'column',width:'100%',height:Dimensions.get('window').height-20,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
       <Text style={{fontFamily:'myfont',color:'#1d79cf',marginBottom:20,fontSize:15}}>{`${route.params.year}-${route.params.month<10?'0'+route.params.month:route.params.month}-${route.params.day<10?'0'+route.params.day:route.params.day} ны Шалгалтын хариу`}</Text>

        <View style={{flexDirection:'row',width:'100%',height:'auto',backgroundColor:'white'}}>
               <DraggableFlatList
                data={route.params.data1}
                renderItem={({ item, index, drag, isActive })=>renderItem2(item, index, drag, isActive)}
                keyExtractor={(item, index) => `kr-${item.eng}${index} `}
                />
                <View style={{width:1,backgroundColor:'black'}}></View>
              <DraggableFlatList
                data={route.params.data2}        
                renderItem={({ item, index, drag, isActive })=>renderItem(item, index, drag, isActive)}
                keyExtractor={(item, index) => `kr-${item.mong}${index} `}
                />              
        </View>  

        <Text style={{marginVertical:10,fontSize:15,textAlign:'center',fontFamily:'myfont',color:'#1d79cf'}}>{'Ta '+route.params.fail+' алдсан байна !'+(route.params.fail!=0?' Алдаагаа шалгаад дахин оролдоно уу':' Танд баяр хүргэе ')}</Text>   
        <TouchableOpacity onPress={checkAndNavigate} style={{width:160,height:45,backgroundColor:'#7de89a',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                         <Text style={{color:'white',fontFamily:'myfont'}}>{route.params.month+'-р сар руу Буцах '}</Text>
         </TouchableOpacity>              
   </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
