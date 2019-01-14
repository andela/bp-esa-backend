/* eslint-disable require-jsdoc */
export function baseAutomationFields(DataTypes) {
  return {
    status: {
      type: DataTypes.ENUM,
      values: ['success', 'failure'],
      allowNull: false,
    },
    statusMessage: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    automationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };
}
export const automationRelationships = {
  foreignKey: 'automationId',
  as: 'automation',
};
