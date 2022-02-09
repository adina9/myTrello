<template>
  <div class="app-header flex j-between pf a-center">
    <div class="left-side flex">
      <span class="material-icons-outlined"> apps </span>
    </div>
    <div class="right-side flex">
      <div class="search bor flex a-center">
        <span class="material-icons-outlined"> search </span>
        <input type="text" placeholder="Search" />
      </div>
      <span class="material-icons-outlined"> equalizer </span>
      <span class="material-icons-outlined"> notifications </span>
      <avatar v-if="board" :member="board.user" />
    </div>
  </div>
</template>
<script>
import Avatar from "./Avatar.vue";
export default {
  components: { Avatar },
  data: () => ({ board: null }),
  async created() {
    await this.loadBoard();
  },
  methods: {
    getBoard() {
      this.board = this.$store.getters.boardForDisplay;
    },
    async loadBoard() {
      let { boardId } = this.$route.params;
      await this.$store.dispatch({
        type: "getBoardById",
        boardId,
      });
      this.getBoard();
    },
  },
};
</script>