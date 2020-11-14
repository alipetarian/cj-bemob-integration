//Post CJ commissions to bemob via sid or shopperid sub id. 
const moment = require('moment')
const { getCommissions, sendBemobPostback } = require('./src/api/services/general.service')
const logging = require('./src/startup/logging')
const { logger } = require('./src/startup/logging')

logging()
const postCommissionsToBemob =  async () => {

  // GET Latest commission from last job
  console.log("HELLO TO POST COMMISSIONS")

  try {

    const { data:{ data } ={} } = await getCommissions()
    const { publisherCommissions:{ count, records} = {} } = data || {}
    
    logger.info("Total Count: "+ count)
    logger.info("Current Date Time UTC "+ moment.utc().format('LLLL'))

    Promise.all(
      records.map( async(record)=>{
        const { shopperId, pubCommissionAmountUsd: payout } = record     
        
        const { data }  = await sendBemobPostback(shopperId, payout)
        
        if(!data.startsWith("<html>")){
          logger.info(`Postback Received for ID: ${shopperId} - Payout: ${payout}`);
        } else{
          logger.error(`Invalid Postback for ID:  ${shopperId} - Payout: ${payout}`);
        }
    
      })
    )

  } catch (err) {
    logger.error('Something went wrong: postCommissionsToBemob'+ err && err.response);
    
  }
}

postCommissionsToBemob();