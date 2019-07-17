module.exports = function(sequelize,DataTypes){
    var applyRecord = sequelize.define('ProjectApplyRecord',{
        applyID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement: true,
        },
        projectID:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },          
        userID:{
            type:DataTypes.INTEGER(11).ZEROFILL,
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

                                
    },{
        freezeTableName: true,
    });
    return applyRecord;
};