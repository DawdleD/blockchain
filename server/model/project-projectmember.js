module.exports = function(sequelize,DataTypes){
    var projectMember = sequelize.define('ProjectMember',{
        memberID:{
            type:DataTypes.INTEGER(8).ZEROFILL,
            primaryKey:true,
            allowNull:false,
        },
        projectID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
        },        
        joinTime:{
            type:DataTypes.DATE
        },       
        memberType:{
            type:DataTypes.INTEGER,
            defaultValue:0,            
        },    
        frozenBalance:{
            type:DataTypes.INTEGER
        },       
        boolRemark:{
            type:DataTypes.INTEGER,
            defaultValue:0,            
        },           
        attitudeScore:{
            type:DataTypes.INTEGER
        },    
        codeScore:{
            type:DataTypes.INTEGER
        },    
        designScore:{
            type:DataTypes.INTEGER
        },                    
        txHash:{
            type:DataTypes.STRING(100)
        },
        logIndex:{
            type:DataTypes.INTEGER
        },            
                                
    },{
        freezeTableName: true,
    });
    return projectMember;
};