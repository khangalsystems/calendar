import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { TouchableWithoutFeedback,StyleSheet,Dimensions } from 'react-native'
import { Modal } from 'react-native'
import WebView from 'react-native-webview'

const AlertModal=({open,close,verify,remain})=>{
    const expired=remain<=0
    return  <Modal visible={open}>
                            <TouchableWithoutFeedback onPress={()=>{}}>
                                <View style={styles.modalOverlay} />
                            </TouchableWithoutFeedback>  
                            <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'transparent'}}>   
                                     <TouchableOpacity onPress={verify} style={{marginHorizontal:30,marginBottom:5,width:Dimensions.get('window').width-100,borderRadius:10,height:50,backgroundColor:'#8fc1e3',justifyContent:'center',alignItems:'center'}}>
                                          <Text style={{color:'white',flexWrap:"wrap"}} >{'Идэвхжүүлэх код oруулах'}</Text>
                                      </TouchableOpacity>
                                        <ImageBackground source={require('../assets/modalimage.png')} imageStyle={{opacity:0.2}} style={styles.Modal2}>
                                            <View style={{width:'100%',height:300}}>
                                                
                                                
                                                <View style={{width:'100%',color:'white',flex:1,height:'auto'}}>
                                                    <WebView     showsHorizontalScrollIndicator={false}
                                                                style={{backgroundColor:'rgba(52, 52, 52, 0.01)',height:320,width:'90%',marginHorizontal:'5%',flexWrap:'wrap'}} 
                                                                source={{html:'<font color="white" size="+7" face="Verdana"><p><strong>Smart Calendar-г идэвхжүүлж ашиглана уу. </strong></p>\r\n\r\n<ol>\r\n\t<li><strong>Онлайнаар SmartCalendar апп идэвхжүүлж ашиглах. Апп ашиглах төлбөр 10000 төгрөг төлөгдснөөр таны утсанд идэвхжүүүлэх кодыг мессежээр илгээнэ.&nbsp;</strong></li>\r\n</ol>\r\n\r\n<ul style=\"margin-left: 40px;\">\r\n\t<li>Хаан банкны 5020202361 /эзэмшигч Батхүү/ дансанд апп идэвхжүүлэх&nbsp;төлбөр 10000 төгрөг төлөх&nbsp;</li>\r\n\t<li>Гүйлгээний утгад утасны дугаараа бичиж илгээнэ</li>\r\n</ul>\r\n\r\n<p>Таны төлсөн төлбөр бидний цаашдын үг цээжилдэг Смарт Календарийн хөгжлийн үйл хэрэгт дэмжлэг болно.</p>\r\n\r\n<p>Баярлалаа :-)</p>\r\n</font>'}} />
                                                </View>
                                            </View>            
                                        </ImageBackground>
                                        <TouchableOpacity onPress={()=>{if(!expired){close()}}}  style={{marginHorizontal:30,width:Dimensions.get('window').width-100,marginTop:5,borderRadius:10,height:50,backgroundColor:'#d12c2c',justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'white',flexWrap:"wrap"}} >{expired?'Ашиглах хугацаа дууссан байна!':'Үргэлжлүүлэх ('+remain+' хоног)'}</Text>
                                        </TouchableOpacity> 
                            </View>  
        </Modal> 
}
const styles = StyleSheet.create({
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
export default AlertModal