import { DBservice } from "./DBservice";

export const groupService = {
    getGroupById,
    addCard
}

async function getGroupById(board, groupId) {
    try {
        const group = await DBservice.get(board, groupId)
        return group
    } catch (err) {
        console.log('err in groupService in getGroupById:', err);
    }
}