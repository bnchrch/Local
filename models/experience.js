module.exports = function(sequelize, DataTypes) {
    var Experience = sequelize.define('Experience', {
        is_active: DataTypes.BOOLEAN,
        expires_at: DataTypes.DATE,
        title: DataTypes.STRING,
        price: DataTypes.FLOAT,
        rate: DataTypes.STRING,
        description: DataTypes.STRING,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        image0: DataTypes.STRING,
        image1: DataTypes.STRING,
        image2: DataTypes.STRING,
        image3: DataTypes.STRING,
        image4: DataTypes.STRING,
        image5: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING,
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
