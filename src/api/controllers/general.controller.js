/* eslint-disable camelcase */

const request = require('request');
const config = require('config');
const moment = require('moment')
const { logger } = require('../../startup/logging');
const { sendVoluumPostback, getCommissions } = require('../services/general.service');

module.exports.testHook = async (req, res) => {
  try {
    
    return res.send('All good. Test hook');
  } catch (err) {
    logger.error('Something went wrong: Test Hook', err && err.response);
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.getCurrentMonthCommissions = async (req, res) => {
  try {
    
    const startDate = moment().utc().startOf("month").format()
    const { data } = await getCommissions(startDate)
    return res.json(data);
  } catch (err) {
    logger.error('Something went wrong: getCurrentMonthCommissions', err && err.response);
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.getRecentCommissions = async (req, res) => {
  try {
    
    const { startDate } = req.query
    let { data : { data }  } = await getCommissions(startDate)
    
    let { publisherCommissions:{ count, records} = {} } = data || {}
    
    logger.info("Date Time"+ Date.now())

    if(count){
      Promise.all(
        records.map( async(record)=>{
          const { shopperId, pubCommissionAmountUsd: payout  } = record
          const { data }  = await sendVoluumPostback(shopperId, payout)
          
          logger.info('Postback Received for ID: '+ shopperId);
          
        })
      )
    }
    return res.json(data);
  } catch (err) {
    logger.error('Something went wrong: getRecentCommissions'+ err && err.response);
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.voluumPostback = async (req, res) => {
  try {
    
    const { cid, payout } = req.query
    
    if (cid) {
      logger.info("POTBACK RECEIVED: "+ cid)
      const { data }  = await sendVoluumPostback(cid, payout)

      console.log('DATA: -----', data)
      res.status(200).json({message:'Postback Received Successfully'});
      
    } else {
      logger.error("POSTBACK ERROR -  NO CLICKID FOUND")
      return res.status(400).json({message: 'No clickId Found'});
    }
  } catch (err) {
    logger.error('Something went wrong: voluumPostback'+ err && err.response);

    return res.status(400).json({
      message: err.message,
    });
  }
};
