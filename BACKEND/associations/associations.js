import { ItemName } from "../models/ItemNameModel.js";
import { Items } from "../models/ItemsModel.js";
import { StoragePlace } from "../models/StoragePlaceModel.js";
import { ActionType } from "../models/ActionTypeModel.js";
import { Logs } from "../models/LogModel.js";
import { User } from "../models/UserModel.js";


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

export{
    ItemName,
    StoragePlace,
    User,
    Items,
    ActionType,
    Logs
};