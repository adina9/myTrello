import { boardService } from "../../services/boardService"

export default {
    state: {
        boards: null,
        currBoard: null
    },
    getters: {
        boardsForDisplay(state) {
            return state.boards
        },
        boardForDisplay(state) {
            return state.currBoard
        }
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards
        },
        setBoard(state, { board }) {
            state.currBoard = board
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit({ type: 'setBoards', boards })
        },
        async updateBoards({ commit }, { boards }) { 
            const updatedBoards = await boardService.updateBoards(boards)
            commit({ type: 'setBoards', boards: updatedBoards })
        },
        async getBoardById({ commit }, { boardId }) {
            const board = await boardService.getBoardById(boardId)
            commit({ type: 'setBoard', board })
        },
        async updateBoard({ commit }, { board }) { //better not to update the whole board, just update the specific property. like board.activities.push(updatedActivities)
            const updatedBoard = await boardService.updateBoard(board)
            commit({ type: 'setBoard', board: updatedBoard })
        },
        async addGroup({ commit }, { board, groupTitle }) {
            const updatedBoard = await boardService.addGroup(board, groupTitle)
            commit({ type: 'setBoard', board: updatedBoard })
        },
        async updateGroup({ commit }, { board, group }) {
            const updatedBoard = await boardService.updateGroup(board, group)
            commit({ type: 'setBoard', board: updatedBoard })
        },
        async addCard({ commit }, { board, group, cardTitle }) {
            const updatedBoard = await boardService.addCard(board, group, cardTitle)
            commit({ type: 'setBoard', board: updatedBoard })
        },
        async updateCard({ commit }, { board, group, card }) {
            const updatedBoard = await boardService.updateCard(board, group, card)
            commit({ type: 'setBoard', board: updatedBoard })
        }

    }
}