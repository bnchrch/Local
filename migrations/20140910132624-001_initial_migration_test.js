var db = require('../models');

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
      console.log('going up');
      migration.addColumn(
          'experiences',
          'is_secret',
          {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
              allowNull: false

          });

    done();
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn('experiences', 'is_secret');
    done();
  }
}
