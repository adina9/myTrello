<template>
  <section class="boards-section flex">
    <div class="sticky-container flex col">
      <div
        :class="['opt flex', { isSelected: currOption === option }]"
        v-for="option in ['boards', 'templates']"
        :key="option"
        @click="selectOption(option)"
      >
        <span></span>
        <p>{{ option }}</p>
      </div>
    </div>
    <div>
      <p>most popular templates</p>
      <div class="boards grid">
        <div
          class="board-template"
          :style="{ backgroundColor: board.style.bgClr }"
          @click="selectBoard(board._id)"
          v-for="board in boards"
          :key="board._id"
        >
          <h3>{{ board.title }}</h3>
          <!-- </router-link> -->
        </div>
      </div>
      <hr />
      <!-- <div class="tamplates">
      <h2>Templates</h2>
      <div class="template" v-for="template  in bo"></div>
    </div> -->
      <!-- <router-view /> -->
    </div>
  </section>
</template>



<script>
export default {
  name: "Boards",
  created() {
    this.loadBoards();
  },
  data() {
    return {
      boards: null,
      currOption: null,
    };
  },
  methods: {
    async loadBoards() {
      await this.$store.dispatch({ type: "loadBoards" });
    },
    selectBoard(boardId) {
      this.$router.push(`/boards/${boardId}`);
    },
    selectOption(option) {
      this.currOption = option;
    },
  },
  computed: {
    boardsForDisplay() {
      this.boards = this.$store.getters.boardsForDisplay;
    },
  },
  watch: {
    "$store.getters.boardsForDisplay"(updatedBoards) {
      this.boards = [...updatedBoards];
    },
  },
};
</script>
