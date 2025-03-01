const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { StoragePlace } = require("../models/StoragePlaceModel");
const { ActionType } = require("../models/ActionTypeModel");
const { Logs } = require("../models/LogModel");
const { User } = require("../models/UserModel");


ItemName.hasMany(Items, { foreignKey: 'itemNameId' });
Items.belongsTo(ItemName, { foreignKey: 'itemNameId' });

StoragePlace.hasMany(Items, { foreignKey: 'storagePlaceId' });
Items.belongsTo(StoragePlace, { foreignKey: 'storagePlaceId' });

User.hasMany(Logs, { foreignKey: 'updatedBy' });
Logs.belongsTo(User, { foreignKey: 'updatedBy' });

ActionType.hasMany(Logs, { foreignKey: 'actionTypeId' });
Logs.belongsTo(ActionType, { foreignKey: 'actionTypeId' });

Items.hasMany(Logs, { foreignKey: 'itemId' });
Logs.belongsTo(Items, { foreignKey: 'itemId' });

module.exports = {
    ItemName,
    StoragePlace,
    User,
    Items,
    ActionType,
    Logs
};