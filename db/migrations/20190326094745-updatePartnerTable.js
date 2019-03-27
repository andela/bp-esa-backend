module.exports = {
  up: (queryInterface, DataTypes) => {
    const changeIdColumn = queryInterface.changeColumn('partners', 'id', {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    });
    const changeNameColumn = queryInterface.changeColumn('partners', 'name', {
      type: DataTypes.STRING,
      allowNull: false,
    });
    const removePartnerId = queryInterface.removeColumn('partners', 'partnerId');
    const removeSlackChannels = queryInterface.removeColumn('partners', 'slackChannels');
    const addChannelId = queryInterface.addColumn('partners', 'channelId', DataTypes.STRING);
    const addChanneName = queryInterface.addColumn('partners', 'channelName', DataTypes.STRING);
    const addLocation = queryInterface.addColumn('partners', 'location', DataTypes.STRING);
    return Promise.all([
      changeIdColumn,
      changeNameColumn,
      removePartnerId,
      removeSlackChannels,
      addChannelId,
      addChanneName,
      addLocation,
    ]);
  },

  down: (queryInterface, DataTypes) => {
    const changeIdColumn = queryInterface.changeColumn('partners', 'id', {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    });
    const changeNameColumn = queryInterface.changeColumn('partners', 'name', DataTypes.STRING);
    const addPartnerId = queryInterface.addColumn('partners', 'partnerId', {
      type: DataTypes.STRING,
      allowNull: false,
    });
    const addSlackChannels = queryInterface.addColumn('partners', 'slackChannels', DataTypes.JSON);
    const removeChannelId = queryInterface.addColumn('partners', 'channelId');
    const removeChanneName = queryInterface.addColumn('partners', 'channelName');
    const removeLocation = queryInterface.addColumn('partners', 'location');
    return Promise.all([
      changeIdColumn,
      changeNameColumn,
      addPartnerId,
      addSlackChannels,
      removeChannelId,
      removeChanneName,
      removeLocation,
    ]);
  },
};
