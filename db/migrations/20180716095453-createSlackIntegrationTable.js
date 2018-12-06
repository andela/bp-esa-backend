module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('slack_integrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      slack_channel: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      is_addition: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
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
    })
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('slack_integrations')
  }
};
