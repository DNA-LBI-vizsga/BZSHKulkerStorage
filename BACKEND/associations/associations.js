const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { StoragePlace } = require("../models/StoragePlaceModel");
const { Value } = require("../models/ValueModel");
const { User } = require("../models/UserModel");


ItemName.hasMany(Items, { foreignKey: 'item_name_id' });
Items.belongsTo(ItemName, { foreignKey: 'item_name_id' });

Value.hasMany(Items, { foreignKey: 'value_id' });
Items.belongsTo(Value, { foreignKey: 'value_id' });

StoragePlace.hasMany(Items, { foreignKey: 'storage_place_id' });
Items.belongsTo(StoragePlace, { foreignKey: 'storage_place_id' });

User.hasMany(Items, { foreignKey: 'user_id' });
Items.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Items, { foreignKey: 'updated_by' });
Items.belongsTo(User, { foreignKey: 'updated_by' });



module.exports = {
    ItemName,
    Value,
    StoragePlace,
    User,
    Items
};