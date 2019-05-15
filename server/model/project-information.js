module.exports = function(sequelize,DataTypes){
    var project = sequelize.define('ProjectInformation',{
        projectID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement: true,
        },
        creatorID:{
            type:DataTypes.INTEGER(8).ZEROFILL,
            allowNull:false,
        },       
        createTime:{
            type:DataTypes.DATE
        },    
        projectType:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },              
        projectStatue:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },      
        projectFee:{
            type:DataTypes.INTEGER
        },          
        projectName:{
            type:DataTypes.STRING(100)
        },
        projectIntro:{
            type:DataTypes.STRING
        },       
        projectPic:{
            type:DataTypes.STRING,
            defaultValue:'/img/class_1.jpg',
        },      
        projectField:{
            type:DataTypes.INTEGER
        },  
        remarkPhase:{
            type:DataTypes.ENUM('PENDING','OPEN','COMPLETED'),
            defaultValue:'PENDING'
        },                              
        txHash:{
            type:DataTypes.STRING(100)
        },
        logIndex:{
            type:DataTypes.INTEGER
        },
        scoreTxHash:{
            type:DataTypes.STRING(100)
        },
        scoreLogIndex:{
            type:DataTypes.INTEGER
        },        
    },{
        freezeTableName: true,
    });
    return project;
};