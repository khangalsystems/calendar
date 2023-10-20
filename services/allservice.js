
import Service from './service';
export default class AllService extends Service {
CheckTokenSaveUser(uname,phone,agetype,calendartoken,notification,district,getnotif,version) {  
    return this.post('CheckTokenSaveUser', {      
        uname:uname,
        phone:phone,
        agetype:agetype,
        calendartoken:calendartoken==''?'0':calendartoken,
        notification:notification,
        district:district,
        getnotif:getnotif,
        version:version
    });
}
GetModalText(){  
    return this.post('GetAbout', {});
}
SaveAppStart(userid,version){  
    return this.post('LoginUserWrite', {
        userindex:userid,
        version:version
    });
}
GetCalendarWords(token) {  
    return this.post('GetCalendarWords', {      
   token:token==''?'0':token,
    });
}
GetYearData(year) {  
    return this.post('GetYearData', {      
        year:year
    });
}
savecomplain(text,email,userid) {  
    return this.post('SaveComplaint', {      
        complaint:text,
        email:email,
        userid:userid
    });
}
Getreklams(token,index) {  
    return this.post('GetNews', {      
       token:token,
       index:index
    });
}
GetAbout() {  
    return this.post('GetAbout', {});
}
getAimagHot() {  
    return this.post('getAimagHot', {});
}
}