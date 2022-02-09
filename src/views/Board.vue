<template>
  <section
    class="board flex col pr"
    v-if="board"
    :style="{ backgroundColor: board.style.bgClr }"
  >
    <board-header :board="board" @get-board="getBoard" />
    <div class="board-area pad flex pa">
      <board-groups
        @update-board="updateBoard($event)"
        :board="board"
        @get-board="getBoard"
      />
      <add-group @add-group="addGroup" />
    </div>
    <router-view v-show="paramsLength > 1" />
  </section>
</template>

<script>
import AddGroup from "../components/AddGroup.vue";
import BoardGroup from "../components/BoardGroup.vue";
import BoardGroups from "../components/BoardGroups.vue";
import BoardHeader from "../components/BoardHeader.vue";

export default {
  components: { BoardHeader, BoardGroup, AddGroup, BoardGroups },
  name: "Board",
  data() {
    return {
      board: null,
      boardId: null,
      paramsLength: null,
    };
  },
  async created() {
    await this.loadBoard();
    this.paramsLength = Object.values(this.$route.params).length;
  },
  methods: {
    getBoard() {
      this.board = this.$store.getters.boardForDisplay;
    },
    async loadBoard() {
      this.boardId = this.$route.params.boardId;
      await this.$store.dispatch({
        type: "getBoardById",
        boardId: this.boardId,
      });
      this.getBoard();
    },
    async addGroup(groupTitle) {
      if (!groupTitle) return;
      await this.$store.dispatch({
        type: "addGroup",
        board: this.board,
        groupTitle: groupTitle,
      });
      this.getBoard();
    },
    async updateBoard(updatedBoard) {
      console.log("updatedBoard:", updatedBoard);
      await this.$store.dispatch({
        type: "updateBoard",
        board: updatedBoard,
      });
      this.getBoard();
    },
  },
  watch: {
    "$route.params"(params) {
      this.paramsLength = Object.values(params).length;
    },
    "$store.getters.boardForDisplay"(updatedBoard) {
      console.log("updatedBoard:", updatedBoard);
      this.board = { ...updatedBoard };
    },
    "$store.getters.boardsForDisplay"(updatedBoards) {
      this.boardId = this.$route.params.boardId;
      this.board = updatedBoards.find((_b) => _b._id === this.boardId);
    },
  },
};
</script>
