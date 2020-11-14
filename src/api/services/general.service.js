const http = require('./http.service');
const gql = require('./gql.service');
const config = require('config');
const moment = require('moment')
const { logger } = require('../../startup/logging');

const CJ_PUBLISHER_ID = config.get('cjPublisherId')

const GET_RECENT_COMMISSIONS = `
  query getRecentCommissions(
    $publisherId: String! , 
    $startDate: String!, 
    $endDate: String!
  ){   
    publisherCommissions(
      forPublishers: [$publisherId],
      sinceEventDate: $startDate,
      beforeEventDate: $endDate,
      actionStatuses: "new",
    ){
      count 
      payloadComplete 
      maxCommissionId
      records {
        actionStatus
        actionTrackerName 
        websiteName 
        advertiserName 
        postingDate
        eventDate
        pubCommissionAmountUsd
        shopperId
        commissionId
        clickDate
        items { 
          quantity 
          perItemSaleAmountPubCurrency 
          totalCommissionPubCurrency 
        }  
      } 
    } 
  }
`

module.exports.getCommissions = (startDate, endDate) => {
  
  startDate= startDate || moment().utc().startOf("day").format()
  endDate= endDate || moment().utc().format()
  
  logger.info("START TIME: "+ startDate)
  logger.info("END TIME: "+ endDate)
  
  const variables = {
    publisherId: CJ_PUBLISHER_ID,
    startDate,
    endDate, 
  }

  const reqData = {
    query: GET_RECENT_COMMISSIONS,
    variables,
  };

  const body = JSON.stringify(reqData);
  return gql.post('/query', body);
};

module.exports.sendBemobPostback = (cid, payout) => {
  const params = {
    cid
  }
  if(payout) params.payout= payout
  return http.get('/postback', { params });
};