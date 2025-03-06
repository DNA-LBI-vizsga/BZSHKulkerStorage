import { ItemName } from "../models/ItemNameModel.js";
import { Items } from "../models/ItemsModel.js";
import { StoragePlace } from "../models/StoragePlaceModel.js";

import { Logs } from "../models/LogModel.js";
import { User } from "../models/UserModel.js";


ItemName.hasMany(Items, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Items.belongsTo(ItemName, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

StoragePlace.hasMany(Items, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Items.belongsTo(StoragePlace, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

User.hasMany(Logs, { foreignKey: 'createdBy', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Logs.belongsTo(User, { foreignKey: 'createdBy', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

ItemName.hasMany(Logs, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Logs.belongsTo(ItemName, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

StoragePlace.hasMany(Logs, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Logs.belongsTo(StoragePlace, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });



export{
    ItemName,
    StoragePlace,
    User,
    Items,
    Logs
};