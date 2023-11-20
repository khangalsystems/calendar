const ip = '192.168.1.111'//43.231.113.13 
const config = {
  advertiseImgPath: 'http://' + ip + ':8000/api/v1/files/advertiseimg/',
  branchImgPath: 'http://' + ip + ':8000/api/v1/files/branchimg/',
  branchLogoPath: 'http://' + ip + ':8000/api/v1/files/branchlogo/',
  workerImgPath: 'http://' + ip + ':8000/api/v1/files/workerimg/',
  workerFilePath: 'http://' + ip + ':8000/api/v1/files/workerfile/',
  userImgPath: 'http://' + ip + ':8000/api/v1/files/userimg/',
  infoImgPath: 'http://' + ip + ':8000/api/v1/files/infoimg/',
  infoFilePath: 'http://' + ip + ':8000/api/v1/files/file/',
  commentImgPath: 'http://' + ip + ':8000/api/v1/files/commentimg/',
  capitalImgPath: 'http://' + ip + ':8000/api/v1/files/capitalimg/',
  complainImgPath: 'http://' + ip + ':8000/api/v1/files/complainimg/',
  complainFilePath: 'http://' + ip + ':8000/api/v1/files/complainfile/',
  forumImgPath: 'http://' + ip + ':8000/api/v1/files/forumimg/',
  forumFilePath: 'http://' + ip + ':8000/api/v1/files/forumfile/',
  pollImgPath: 'http://' + ip + ':8000/api/v1/files/pollimg/',
  pollFilePath: 'http://' + ip + ':8000/api/v1/files/pollfile/',
  roomImgPath: 'http://' + ip + ':8000/api/v1/files/roomimg/',
  url: 'http://' + ip + ':8000/api/v1',
  filePath: 'http://' + ip + ':8000/api/v1/files/file/',
  examplefilePath: 'http://' + ip + ':8000/api/v1/files/examplefile/',
  propertyTypes: ['', 'сууц', 'граж', 'агуулах'],
  paymentBranchType: ['ШИЛЭН СӨХ', 'САЙН СӨХ', 'СУПЕР СӨХ'],
  stageTypes: ['Шинэ', 'Хүлээн авсан', 'Хариу оруулсан','Хаагдсан'],
  complainTypes: ['Санал', 'Гомдол', 'Дуудлага'],
  ownerTypes: ['Өмчлөгч', 'Хамтран өмчлөгч', 'Түрээслэгч','Бусад'],
  dateFormat:'YYYY/MM/DD',
  dateTimeFormat:'YYYY/MM/DD HH:MM',
}
export default config
