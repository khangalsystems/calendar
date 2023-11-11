  export const execQuery=async (tx,query)=>{
     return await new Promise(async resolve =>{
         tx.executeSql(
          query
          ,[]
          ,(tx,res)=>{  
              resolve(query)
            }
          ,(tx,res)=>{
             resolve(null)
            console.log('error main')
          }     
          )
    })

  }