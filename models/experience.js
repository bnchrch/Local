module.exports = function(sequelize, DataTypes) {
    var Experience = sequelize.define('Experience', {
        title: DataTypes.STRING,
        price: DataTypes.FLOAT,
        rate: DataTypes.STRING,
        description: DataTypes.STRING,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Experience.belongsTo(models.User)
            }
        },
        tableName: 'experiences'
    });

    return Experience
}
