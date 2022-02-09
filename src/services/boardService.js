import { DBservice } from "./DBservice"
import { Utils } from "./utilsService"

export const boardService = {
    query,
    getBoardById,
    remove,
    save,
    addGroup,
    updateGroup,
    addCard,
    updateCard,
    updateBoard,
    getCardById,
    updateBoards
}


const BOARDS_KEY = 'boards'

async function query() {
    try {
        var boards = await DBservice.query(BOARDS_KEY)
        return boards
    } catch {
        console.log('err in boardService in query:', err);
    }
}

async function getBoardById(id) {
    try {
        return await DBservice.get(BOARDS_KEY, id);
    } catch (err) {
        console.log('err in boardService in getById:', err);
    }
}

async function remove(id) {
    try {
        return await DBservice.remove(BOARDS_KEY, id);
    } catch (err) {
        console.log('err in boardService in remove:', err);
    }
}

async function save(board) { //support editing and adding at the same time
    try {
        if (board._id) return await DBservice.put(BOARDS_KEY, board);
        else return await DBservice.post(BOARDS_KEY, board)
    } catch (err) {
        console.log('err in baordService in save:', err);
    }

}

async function updateBoard(board) {
    try {
        return save(board)
    } catch (err) {
        console.log('err in boardService in updateBoard:', err);
    }
}
async function updateBoards(boards) {
    try {
        return await DBservice.putMany(BOARDS_KEY, boards);
    } catch (err) {
        console.log('err in boardService in updateBoard:', err);
    }
}

async function addGroup(board, groupTitle) {
    try {
        const updatedBoard = {
            ...board,
            groups: [
                ...board.groups,
                {
                    _id: Utils.makeId(),
                    title: groupTitle,
                    cards: [],
                    style: {}
                }
            ]
        }
        return save(updatedBoard)
    } catch (err) {
        console.log('err in boardService in addGroup:', err);
    }
}

async function updateGroup(board, group) {
    try {
        const updatedGroup = { ...group }
        const updatedGroups = board.groups.map(currGroup => currGroup._id === group._id ? updatedGroup : currGroup)
        const updatedBoard = { ...board, groups: [...updatedGroups] }
        return save(updatedBoard)
    } catch (err) {
        console.log('err in boardService in updateGroup:', err);
    }
}


async function addCard(board, group, cardTitle) {
    try {
        const updatedGroup = {
            ...group,
            cards: [
                ...group.cards,
                {
                    _id: Utils.makeId(),
                    title: cardTitle,
                    style: { isFull: false, isDone: false, bgColor: 'white' },
                    createdAt: Date.now(),
                    labels: [],
                    attachments: [],
                    badgets: [],
                    checklists: [],
                    comments: [],
                    attachments: []
                }
            ]
        }
        return await updateGroup(board, updatedGroup)
    } catch (err) {
        console.log('err in boardService in addCard:', err);
    }
}

async function updateCard(board, group, card) {
    try {
        const updatedCard = { ...card }
        const updatedCards = group.cards.map(card => card._id === updatedCard._id ? updatedCard : card)
        const updatedGroup = { ...group, cards: [...updatedCards] }
        return updateGroup(board, updatedGroup)
    } catch (err) {
        console.log('err in boardService in updateCard:', err);
    }
}

function getCardById(board, cardId) {
    try {
        var currCard;
        var currGroup;
        board.groups.forEach((group) =>
            group.cards.forEach((card) => {
                if (card._id === cardId) {
                    currCard = JSON.parse(JSON.stringify(card));
                    currGroup = JSON.parse(JSON.stringify(group));
                }
            })
        );
        return { currGroup, currCard }
    } catch (err) {
        console.log('err in boardService in getCardById:', err);
    }
}


