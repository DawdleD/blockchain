module.exports = function(sequelize,DataTypes){
    var createRecord = sequelize.define('ProjectCreateRecord',{
        applyID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement: true,
        },
        userID:{
            type:DataTypes.INTEGER(8).ZEROFILL,
            allowNull:false,
        },       
        applyType:{
            type:DataTypes.ENUM('COURSE', 'PROJECT'),
            allowNull:false,
        },    
        paymentID:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },    
        applyStatue:{
            type:DataTypes.ENUM('PENDING','ACCEPTED','REJECTED','WAITING','CANCEL'),
            defaultValue:'WAITING',            
        },                 
        projectType:{
            type:DataTypes.INTEGER
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
            type:DataTypes.STRING
        },      
        projectField:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },  
                                
    },{
        freezeTableName: true,
    });
    return createRecord;
};