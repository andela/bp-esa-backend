
export const automationStatus = DataTypes => ({
  status: {
    type: DataTypes.ENUM,
    values: ['success', 'failure'],
    allowNull: false,
  },
  statusMessage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

export default (sequelize, DataTypes) => {
  const EmailAutomation = sequelize.define('emailAutomation', Object.assign(
    automationStatus(DataTypes),
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recipient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  ));

  EmailAutomation.associate = (models) => {
    EmailAutomation.belongsTo(models.Automation, {
      foreignKey: {
        name: 'automationId',
      },
    });
  };
  return EmailAutomation;
};
