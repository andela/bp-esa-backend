module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('freckle_integrations', {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      partner_tag: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          as: 'userId'
        }
      },
      partner_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'partners',
          key: 'id',
          as: 'partnerId'
        }
      }
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('freckleIntegrations');
  }
};
