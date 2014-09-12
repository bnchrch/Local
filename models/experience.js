module.exports = function(sequelize, DataTypes) {
    var Experience = sequelize.define('Experience', {
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        is_secret: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        expires_at: DataTypes.DATE,
        title: DataTypes.STRING,
        price: DataTypes.FLOAT,
        rate: DataTypes.STRING,
        description: DataTypes.TEXT,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        image0: DataTypes.STRING,
        image1: DataTypes.STRING,
        image2: DataTypes.STRING,
        image3: DataTypes.STRING,
        image4: DataTypes.STRING,
        image5: DataTypes.STRING,
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: -180, max: 180 }
        },
        street_name: DataTypes.STRING,
        street_number: DataTypes.STRING,
        zipcode: DataTypes.STRING,
        state: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING

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
