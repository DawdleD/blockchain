module.exports = function(sequelize,DataTypes){
    var scoreRecord = sequelize.define('ProjectScoreRecord',{
        projectID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
        },
        userID:{
            type:DataTypes.INTEGER(8).ZEROFILL,
            primaryKey:true,
            allowNull:false,
        },
        scorerID:{
            type:DataTypes.INTEGER(8).ZEROFILL,
            primaryKey:true,
            allowNull:false,
        },                
        scoreTime:{
            type:DataTypes.DATE
        },       
        attitudeScore:{
            type:DataTypes.INTEGER,
            defaultValue:0,
        },    
        codeScore:{
            type:DataTypes.INTEGER,
            defaultValue:0,
        },    
        designScore:{
            type:DataTypes.INTEGER,
            defaultValue:0,
        },                   
              
                                
    },{
        freezeTableName: true,
    });
    return scoreRecord;
};