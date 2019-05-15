pragma solidity ^ 0.4.24;
import "./SafeMath.sol";
contract LightProject {
    using SafeMath for uint256;
    event LogRegisterProject(uint indexed creatorID,uint indexed projectID, 
    uint regTime,ProjectTypes projectType,string projectName,string projectIntro,uint projectField,
    uint[] memberID,uint[] FrozenBalanceList);
    event LogAttendProject(uint indexed memberID,uint indexed projectID, uint joinTime,MemberTypes memberType);
    event LogRewardMessage(uint indexed memberID, uint indexed projectID, uint awardAmount, 
    uint awardType,uint awardTime,string awardReason,uint rewardID,uint senderID);
    event LogScoreEvent(uint[] scorememberID,uint8[] attitudeScore,
    uint8[] codeScore,uint8[] designScore, uint indexed projectID,uint scoreTime);
    event LogUserState(uint indexed userID,string userName,address userAddress,uint time);


    //IMPORTANT!!
    event LogTransferEvent(address indexed from,uint msgVal,bytes32 indexed TID,uint Time);
    //IMPORTANT!!
    
    
    enum ProjectTypes {
        Train,
        Official
    }

    enum MemberTypes {
        Supporter,
        Creator        
    }   

    //记录用户可取走的金额数目
    struct Member {
        uint256 balance;//可周转余额
    }
    mapping(address => Member) internal addressToMember;

    address constant specialAcc = 0x4A21CC525e3605F89424AC0c9843dc25baF43FFA;
        

    modifier onlyCreatorOf(address from) {
        require(from==specialAcc,"Illegal Access");    
        _;
    }


    //Comfirm Payment & emit it
    function submitPayment(bytes32 TID) external payable{
        emit LogTransferEvent(msg.sender,msg.value,TID,now);
    }
    
    function submitReward(
        uint memberID,uint projectID,uint awardAmount, 
        uint awardType,uint awardTime,string awardReason,uint rewardID,uint senderID) external onlyCreatorOf(msg.sender){
        emit LogRewardMessage(memberID,projectID,awardAmount,awardType,awardTime,awardReason,rewardID,senderID);
    }
    
    function submitScore(
        uint[] scorememberID,uint8[] attitudeScore,
        uint8[] codeScore,uint8[] designScore, uint projectID,uint scoreTime) external onlyCreatorOf(msg.sender){
        emit LogScoreEvent(scorememberID,attitudeScore,codeScore,designScore,projectID,scoreTime);    
    }
    
    // event LogRegisterProject(uint indexed creatorID,uint indexed projectID, 
    // uint regTime,ProjectTypes projectType,string projectName,string projectIntro,uint projectField.
    // uint[] memberID,uint[] FrozenBalanceList);
    
    function submitProjectState(
        uint creatorID,uint projectID, 
        uint regTime,ProjectTypes projectType,string projectName,string projectIntro,uint projectField,
        uint[] memberID,uint[] FrozenBalanceList) external onlyCreatorOf(msg.sender){
        emit LogRegisterProject(
            creatorID,projectID,regTime,projectType,
            projectName,projectIntro,projectField,memberID,FrozenBalanceList);
    }
    
    // event LogUserState(uint indexed userID,string userName,address userAddress,uint time);
    function submitUserState(
        uint userID,string userName,address userAddress,uint time
    )external onlyCreatorOf(msg.sender){
        emit LogUserState(userID,userName,userAddress,time);   
    }

    //type:
    //0:add
    //1:sub
    //结束项目时，站点服务器通过修改状态变量登记用户返还款项
    function modifyBalance(address[] user,uint[] amount,uint8[] modtype) external onlyCreatorOf(msg.sender){
        for(uint index = 0;index<user.length;index++){
            if(modtype[index]==0){
                addressToMember[user[index]].balance = addressToMember[user[index]].balance.add(amount[index]);
            }
            if(modtype[index]==1){
                addressToMember[user[index]].balance = addressToMember[user[index]].balance.sub(amount[index]);
            }    
        }
    
        
    }

    //Contract Balance...
    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    //用户查询自己在合约中的可取款项
    function getBalance(address user) public view returns(uint256 balanceValue){
        return addressToMember[user].balance;
    }

    //用户调用该函数从合约中取走款项
    function withdraw(uint256 amount) external returns (uint256) {
        require(address(this).balance >= amount);
        addressToMember[msg.sender].balance = addressToMember[msg.sender].balance.sub(amount);
        msg.sender.transfer(amount);
        return addressToMember[msg.sender].balance;
    }    

}