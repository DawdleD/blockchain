var Web3 = require('web3');
var projectconfig=require('../solidity/eproject_abi');
var projectABI=projectconfig.projectABI;
var projectaddress=projectconfig.projectaddress;
// 生成web3实例与合约实例，并配置合约事件监听器

const ProjectInfo = require('../service/project-information');
const PaymentRecord=require('../service/project-paymentrecord');
const RewardRecord=require('../service/project-rewardrecord');

const PaymentRecord_Con=require('../controllers/project/paymentrecord');

  //GET web3&contract Instance
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
  var eprojectContractInstance =  new web3.eth.Contract(projectABI, projectaddress);
  //GET web3 Instance

  
// event LogScoreEvent(uint[] scoreMemberID,uint8[] attitudeScore,
// uint8[] codeScore,uint8[] designScore, uint indexed projectID,uint scoreTime);

eprojectContractInstance.events.LogScoreEvent()
.on('data', (event) => {
  console.log("LogScoreEvent"); 
  console.log(event.returnValues);
  console.log(event.transactionHash);
  console.log(event.logIndex);
  //     regProjectScoreOnChain:'UPDATE project SET scoreTxHash=?, scoreLogIndex=? WHERE projectID=?',
  ProjectInfo.update({projectID:event.returnValues.projectID},{scoreTxHash:event.transactionHash,scoreLogIndex:event.logIndex})
  // asyncquery(projectSQL.regProjectScoreOnChain,[event.transactionHash,event.logIndex,event.returnValues.projectID]);

})
.on('changed', (event) => {
})
.on('error', console.error);

// event LogRewardMessage(address indexed MemberAddress, uint indexed projectID, uint awardAmount, 
//   uint awardType,uint awardTime,string awardReason);
eprojectContractInstance.events.LogRewardMessage()
.on('data', (event) => {
  console.log("LogRewardMessage"); 
  // console.log(event.returnValues);
  console.log(event.transactionHash);
  console.log(event.logIndex);
  //     regRewardOnChain:'UPDATE rewardRecord SET txHash=?, logIndex=? WHERE rewardID=?',
  // asyncquery(projectSQL.regRewardOnChain,[event.transactionHash,event.logIndex,event.returnValues.rewardID]);
  RewardRecord.update({rewardID:event.returnValues.rewardID},{txHash:event.transactionHash,logIndex:event.logIndex});

})
.on('changed', (event) => {
})
.on('error', console.error);

// // event LogTransferEvent(address indexed from,uint msgVal,bytes32 indexed TID,uint Time);
eprojectContractInstance.events.LogTransferEvent()
.on('data', (event) => {
  console.log("LogTransferEvent"); 
  // console.log(event.returnValues);
  var Msgval=event.returnValues.msgVal;
  var TID=web3.utils.hexToAscii(event.returnValues.TID);
  var ID=TID.substr(1);
  PaymentRecord_Con.comfirmPayment(ID,Msgval);
  // sqlOperation.comfirmPayment(ID,Msgval);
  console.log(web3.utils.hexToAscii(event.returnValues.TID));
  console.log(event.transactionHash);
  console.log(event.logIndex);
  //Register Payment Information ON Chain
  //     regPaymentOnChain:'UPDATE paymentRecord SET txHash=?, logIndex=? WHERE paymentID=?',
  // asyncquery(projectSQL.regPaymentOnChain,[event.transactionHash,event.logIndex,ID]);
  PaymentRecord.update({paymentID:ID},{txHash:event.transactionHash,logIndex:event.logIndex});
})
.on('changed', (event) => {
  // remove event from local database
})
.on('error', console.error);

// LogRegisterProject

eprojectContractInstance.events.LogRegisterProject()
.on('data', (event) => {
  console.log("LogRegisterProject"); 
  console.log(event.returnValues);
  var ID=event.returnValues.projectID;
  console.log(event.transactionHash);
  console.log(event.logIndex);
  //     regProjectOnChain:'UPDATE project SET txHash=?, logIndex=? WHERE projectID=?',
  ProjectInfo.update({projectID:ID},{txHash:event.transactionHash,logIndex:event.logIndex});
  // asyncquery(projectSQL.regProjectOnChain,[event.transactionHash,event.logIndex,ID]);
})
.on('changed', (event) => {
  // remove event from local database
})
.on('error', console.error);


// Unused temporarily
//event LogUserState(uint indexed userID,string userName,address userAddress,uint time);
eprojectContractInstance.events.LogUserState()
.on('data', (event) => {
  console.log("LogUserState"); 
  console.log(event.returnValues);
  var ID=event.returnValues.userID;
  console.log(event.transactionHash);
  console.log(event.logIndex);
  //Register Payment Information ON Chain
  //     regUserOnChain:'UPDATE user SET txHash=?, logIndex=? WHERE userId=?',
  // asyncquery(projectSQL.regUserOnChain,[event.transactionHash,event.logIndex,ID]);
})
.on('changed', (event) => {
  // remove event from local database
})
.on('error', console.error);



module.exports = {web3,eprojectContractInstance};
