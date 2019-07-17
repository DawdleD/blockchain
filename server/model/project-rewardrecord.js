module.exports = function(sequelize,DataTypes){
    var rewardRecord = sequelize.define('ProjectRewardRecord',{
        rewardID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false,
        },
        projectID:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },        
        userID:{
            type:DataTypes.INTEGER(11).ZEROFILL,
            allowNull:false,
        },               
        awardTime:{
            type:DataTypes.DATE
        },       
        awardType:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },    
        awardReason:{
            type:DataTypes.STRING(100)
        },       
        awardAmount:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },             
        txHash:{
            type:DataTypes.STRING(100)
        },
        logIndex:{
            type:DataTypes.INTEGER
        },      
        senderID:{
            type:DataTypes.INTEGER(11).ZEROFILL,
            allowNull:false,
        },                 
                                
    },{
        freezeTableName: true,
    });
    return rewardRecord;
};