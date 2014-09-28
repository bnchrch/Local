module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
      migration.createTable(
          'secrets',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              userId: {
                  type: DataTypes.INTEGER
              },

              createdAt: {
                  type: DataTypes.DATE
              },
              updatedAt: {
                  type: DataTypes.DATE
              },
              is_active: {
                  type: DataTypes.BOOLEAN,
                  defaultValue: false,
                  allowNull: false
              },
              expires_at: DataTypes.DATE,
              title: DataTypes.STRING,
              description: DataTypes.TEXT,
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
                  associate: function (models) {
                      Experience.belongsTo(models.User)
                  }

              },
              instanceMethods: {
                  hasUser: function (user) {
                      if (user.id === this.userId) {
                          return true;
                      }
                      else return false
                  }
              }
          }
      );

    done()
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('secrets');
    done()
  }
}
