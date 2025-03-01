const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { StoragePlace } = require("../models/StoragePlaceModel");

const { User } = require("../models/UserModel");


ItemName.hasMany(Items, { foreignKey: 'itemNameId' });
Items.belongsTo(ItemName, { foreignKey: 'itemNameId' });

StoragePlace.hasMany(Items, { foreignKey: 'storagePlaceId' });
Items.belongsTo(StoragePlace, { foreignKey: 'storagePlaceId' });

User.hasMany(Items, { foreignKey: 'createdBy' });
Items.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Items, { foreignKey: 'updatedBy' });
Items.belongsTo(User, { foreignKey: 'updatedBy' });



module.exports = {
    ItemName,
    StoragePlace,
    User,
    Items
};