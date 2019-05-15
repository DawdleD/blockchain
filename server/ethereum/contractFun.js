var Web3 = require('web3');
var web3Instance=require('./initWeb3').web3
var eprojectContractInstance=require('./initWeb3').eprojectContractInstance

// 导入用户私钥；用于在链上发布项目状态、用户状态的相关函数
module.exports ={
  //Import special key & Create special account
  //342125bb9bdb93e8338569f8beea36088412341abba9664b67af6ec1c2c49e7b
  //0x4A21CC525e3605F89424AC0c9843dc25baF43FFA
  importSpeAccount:async function ()
  {
    try {
      // console.log(web3Instance)
      await web3Instance.eth.accounts.wallet.add('0x342125bb9bdb93e8338569f8beea36088412341abba9664b67af6ec1c2c49e7b');
    } catch (error) {
      console.log(error);
    }
  },

  // function submitReward(
  //   uint memberId,uint projectId,uint awardAmount, 
  //   uint awardType,uint awardTime,string awardReason)
  emitRewardEvent:async function (
    memberId,projectId,awardAmount,awardType,awardTime,awardReason,
    rewardId,senderId)
  {
    try {
      // await web3Instance.eth.accounts.wallet.add('0x342125bb9bdb93e8338569f8beea36088412341abba9664b67af6ec1c2c49e7b');
      var res=await eprojectContractInstance.methods.submitReward(
        memberId,projectId,awardAmount,awardType,awardTime,awardReason,rewardId,senderId
      )
      .send({
        from: "0x4A21CC525e3605F89424AC0c9843dc25baF43FFA",
        gas: 100000
      })
      //If work when adding 'async'
      .on('receipt', function (receipt) {
        // console.log('receipt received');
      })
      .on('error', function (error) {
        throw error
      })
      // console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  modifyBalance:async function(userList,amountList,modtypeList){
    try {

      // Turn Finney Into Wei
      for(var index in amountList){
        amountList[index]=await web3Instance.utils.toWei(amountList[index].toString(), 'finney');
      }
      var res=await eprojectContractInstance.methods.modifyBalance(
        userList,amountList,modtypeList
      )
      .send({
        from: "0x4A21CC525e3605F89424AC0c9843dc25baF43FFA",
        gas: 200000
      })
      //If work when adding 'async'
      .on('receipt', function (receipt) {
        // console.log('receipt received');
      })
      .on('error', function (error) {
        throw error
      })
      // console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // function submitScore(
  //   uint[] scoreMemberID,uint8[] attitudeScore,
  //   uint8[] codeScore,uint8[] designScore, uint projectId,uint scoreTime) external onlyCreatorOf(msg.sender){
  emitScoreEvent:async function (scoreMemberID,attitudeScore,codeScore,designScore,projectId,scoreTime)
  {
    try {
      // await web3Instance.eth.accounts.wallet.add('0x342125bb9bdb93e8338569f8beea36088412341abba9664b67af6ec1c2c49e7b');
      var res=await eprojectContractInstance.methods.submitScore(
        scoreMemberID,attitudeScore,codeScore,designScore,projectId,scoreTime
      )
      .send({
        from: "0x4A21CC525e3605F89424AC0c9843dc25baF43FFA",
        gas: 100000
      })
      //If work when adding 'async'
      .on('receipt', function (receipt) {
        // console.log('receipt received');
      })
      .on('error', function (error) {
        throw error
      })
      // console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // function submitProjectState(
  //   uint creatorId,uint projectId, 
  //   uint regTime,ProjectTypes projectType,string projectName,string projectIntro,uint projectField,
  //   uint[] memberId,uint[] FrozenBalanceList)
  emitProjectRegisterEvent:async function (creatorId,projectId,regTime,projectType,projectName,projectIntro,
    projectField,memberId,FrozenBalanceList)
    {
      try {
        // await web3Instance.eth.accounts.wallet.add('0x342125bb9bdb93e8338569f8beea36088412341abba9664b67af6ec1c2c49e7b');
        var res=await eprojectContractInstance.methods.submitProjectState(
          creatorId,projectId,regTime,projectType,projectName,projectIntro,
          projectField,memberId,FrozenBalanceList
        )
        .send({
          from: "0x4A21CC525e3605F89424AC0c9843dc25baF43FFA",
          gas: 100000
        })
        //If work when adding 'async'
        .on('receipt', function (receipt) {
          // console.log('receipt received');
        })
        .on('error', function (error) {
          throw error
        })
        // console.log(res);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },  


  //   function submitUserState(
  //     uint userId,string userName,address userAddress,uint time
  // )    
  emitMemberRegisterEvent:async function (userId,userName,userAddress,time)
    {
      try {
        var res=await eprojectContractInstance.methods.submitUserState(
          userId,userName,userAddress,time
        )
        .send({
          from: "0x4A21CC525e3605F89424AC0c9843dc25baF43FFA",
          gas: 50000
        })
        //If work when adding 'async'
        .on('receipt', function (receipt) {
          // console.log('receipt received');
        })
        .on('error', function (error) {
          throw error
        })
        // console.log(res);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },  
}

