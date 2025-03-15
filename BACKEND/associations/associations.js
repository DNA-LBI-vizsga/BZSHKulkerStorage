import { ItemName } from "../models/ItemNameModel.js";
import { Item } from "../models/ItemModel.js";
import { StoragePlace } from "../models/StoragePlaceModel.js";
import { StorageConn } from "../models/StorageConnModel.js";
import { Logs } from "../models/LogModel.js";
import { User } from "../models/UserModel.js";


ItemName.hasMany(Item, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Item.belongsTo(ItemName, { foreignKey: 'itemNameId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

StoragePlace.hasMany(StorageConn, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
StorageConn.belongsTo(StoragePlace, { foreignKey: 'storagePlaceId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

Item.hasMany(StorageConn, { foreignKey: 'itemId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
StorageConn.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });



export{
    ItemName,
    StoragePlace,
    User,
    Item,
    Logs
};