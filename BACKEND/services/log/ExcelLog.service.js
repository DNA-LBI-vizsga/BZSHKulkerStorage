import { Logs } from "../../models/LogModel.js";
import { ItemName } from "../../models/ItemNameModel.js";
import { StoragePlace } from "../../models/StoragePlaceModel.js";
import { User } from "../../models/UserModel.js";
import { Item } from "../../models/ItemModel.js";

import sequelize from "sequelize";
import excel from 'exceljs';

const { Op } = sequelize;


//Log fetch
async function getLogs(req) {
    const where = {};
    const { itemNameId, storagePlaceId, createdBy, fromDate, toDate } = req.body;

    if (itemNameId) where.itemNameId = itemNameId;
    if (storagePlaceId) where.storagePlaceId = storagePlaceId;
    if (createdBy) where.createdBy = createdBy;

    if (fromDate && toDate) {
        where.createdAt = {
            [Op.and]: [{ [Op.gte]: fromDate }, { [Op.lte]: toDate }]
        };
    } else if (fromDate) {
        where.createdAt = { [Op.gte]: fromDate };
    } else if (toDate) {
        where.createdAt = { [Op.lte]: toDate };
    }

    try {
        const logs = await Logs.findAll({ where });

        return await Promise.all(logs.map(async (log) => {
            const itemId = await Item.findOne({ where: { id: log.itemId } });
            const itemName = await ItemName.findOne({ where: { id: log.itemNameId } });
            const storagePlace = await StoragePlace.findOne({ where: { id: log.storagePlaceId } });
            const user = await User.findOne({ where: { id: log.createdBy } });

            return {
                id: log.id,
                itemId: itemId ? itemId.item : 'Unknown',
                itemName: itemName ? itemName.item : 'Unknown',
                storagePlace: storagePlace ? storagePlace.storage : 'Unknown',
                actionType: log.actionType,
                createdAt: new Date(log.createdAt).toLocaleString(), 
                createdBy: user ? user.userEmail : 'Unknown',
            };
        }));
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw new Error("Error fetching logs");
    }
}


//Excel generator for logs
async function createExcel(data) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Logs');

    worksheet.columns = [
        { header: 'Azonosító', key: 'id', width: 10 },
        { header: 'Tárgy', key: 'itemName', width: 20 },
        { header: 'Tároló', key: 'storagePlace', width: 20 },
        { header: 'Cselekvés', key: 'actionType', width: 20 },
        { header: 'Felvitel ideje', key: 'createdAt', width: 25 },
        { header: 'Felvitelt végző felhasználó', key: 'createdBy', width: 30 }
    ];

    worksheet.addRows(data);

    return workbook.xlsx.writeBuffer();
}


export { 
    getLogs,
    createExcel
};