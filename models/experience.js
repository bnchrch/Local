module.exports = function(sequelize, DataTypes) {
    var Experience = sequelize.define('Experience', {
        title: DataTypes.STRING,
        price: DataTypes.FLOAT,
        rate: DataTypes.STRING,
        description: DataTypes.STRING,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        image: DataTypes.STRING,
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT
    }, {
        classMethods: {
            associate: function(models) {
                Experience.belongsTo(models.User)
            }

        },
        instanceMethods: {
            hasUser: function(user) {
                if (user.id === this.userId) {
                    return true;
                }
                else return false
            }
        },
        tableName: 'experiences'
    });

    return Experience
}
