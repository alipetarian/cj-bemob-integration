//Post CJ commissions to bemob via sid or shopperid sub id. 
const moment = require('moment')
const { getCommissions, sendVoluumPostback } = require('./src/api/services/general.service')
const logging = require('./src/startup/logging')
const { logger } = require('./src/startup/logging')

logging()
const postCommissionsToVoluum =  async () => {

  // GET Latest commission from last job
  console.log("HELLO TO POST COMMISSIONS")

  try {

    const { data:{ data } ={} } = await getCommissions("2022-02-01T00:00:00Z")
    const { publisherCommissions:{ count, records} = {} } = data || {}
    
    logger.info("Total Count: "+ count)

    logger.info("Current Date Time UTC "+ moment.utc().format('LLLL'))
    logger.info(records)

    const approvedCommissions = records.filter(item=> item.pubCommissionAmountUsd > 0)

    console.log('----APPROVED COMMSSIONS ', approvedCommissions)
    
    Promise.all(
      approvedCommissions.map( async(record)=>{
        const { shopperId, pubCommissionAmountUsd: payout } = record     
        
        const { data }  = await sendVoluumPostback(shopperId, payout)
        logger.info(`Postback Received for ID: ${shopperId} - Payout: ${payout}`);
      })
    )

  } catch (err) {
    logger.error('Something went wrong: postCommissionsToVoluum'+ err && err.response);
    
  }
}

postCommissionsToVoluum();